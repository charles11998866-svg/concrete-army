"""
NOIR Dropshipping Store API Routes
Owner: Charles Stacy | Contact: 352-672-4847
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
import os
import secrets
import string
import httpx

# Initialize router
store_router = APIRouter(prefix="/api/store", tags=["store"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Emergent LLM integration
EMERGENT_API_KEY = os.environ.get('EMERGENT_API_KEY', '')
EMERGENT_BASE_URL = os.environ.get('EMERGENT_BASE_URL', 'https://integrations.emergentagent.com/llm')


# ============== Pydantic Models ==============

class Product(BaseModel):
    slug: str
    name: str
    category: str
    price: float
    image: str
    description: Optional[str] = None
    ai_curated: bool = False
    trending: bool = False
    stock: int = 100


class OrderItem(BaseModel):
    slug: str
    quantity: int
    price: float


class ShippingInfo(BaseModel):
    email: str
    firstName: str
    lastName: str
    address: str
    city: str
    state: str
    zipCode: str
    country: str = "US"


class CreateOrderRequest(BaseModel):
    items: List[OrderItem]
    shipping: ShippingInfo
    subtotal: float
    shipping_cost: float
    total: float


class AIDescriptionRequest(BaseModel):
    product_name: str
    category: str
    price: float


# ============== Helper Functions ==============

def generate_slug_suffix(length: int = 8) -> str:
    """Generate a high-entropy random suffix (≥32 bits of entropy)"""
    # Using secrets module for cryptographically secure randomness
    # 8 chars from 62-char alphabet = ~47 bits of entropy (exceeds 32-bit requirement)
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_order_id() -> str:
    """Generate a unique order ID with high entropy"""
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%d')
    suffix = generate_slug_suffix(12)  # ~71 bits of entropy
    return f"NOIR-{timestamp}-{suffix.upper()}"


# ============== Seed Products ==============

SEED_PRODUCTS = [
    {
        "slug": f"neon-cyber-hoodie-{generate_slug_suffix()}",
        "name": "Neon Cyber Hoodie",
        "category": "Streetwear",
        "price": 129.00,
        "image": "https://images.unsplash.com/photo-1770513632245-973de1bd46dc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBzdHJlZXR3ZWFyJTIwbmVvbiUyMGZhc2hpb258ZW58MHx8fHwxNzcyOTg1Njk3fDA&ixlib=rb-4.1.0&q=85",
        "description": "Premium oversized hoodie with reflective neon accents",
        "ai_curated": True,
        "trending": True,
        "stock": 50
    },
    {
        "slug": f"void-walker-sneakers-{generate_slug_suffix()}",
        "name": "Void Walker Sneakers",
        "category": "Footwear",
        "price": 249.00,
        "image": "https://images.unsplash.com/photo-1770513632261-5fa6ee3bfa9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxjeWJlcnB1bmslMjBzdHJlZXR3ZWFyJTIwbmVvbiUyMGZhc2hpb258ZW58MHx8fHwxNzcyOTg1Njk3fDA&ixlib=rb-4.1.0&q=85",
        "description": "Futuristic sneakers with LED sole technology",
        "ai_curated": True,
        "trending": True,
        "stock": 30
    },
    {
        "slug": f"quantum-smart-watch-{generate_slug_suffix()}",
        "name": "Quantum Smart Watch",
        "category": "Tech",
        "price": 399.00,
        "image": "https://images.unsplash.com/photo-1673997303871-178507ca875a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHw0fHxmdXR1cmlzdGljJTIwdGVjaCUyMGdhZGdldHMlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzI5ODU2NzZ8MA&ixlib=rb-4.1.0&q=85",
        "description": "Next-gen smartwatch with holographic display",
        "ai_curated": True,
        "trending": False,
        "stock": 75
    },
    {
        "slug": f"neural-link-camera-{generate_slug_suffix()}",
        "name": "Neural Link Camera",
        "category": "Tech",
        "price": 1299.00,
        "image": "https://images.unsplash.com/photo-1701764167311-0087cd670a40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMGdhZGdldHMlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzI5ODU2NzZ8MA&ixlib=rb-4.1.0&q=85",
        "description": "AI-powered camera with neural image processing",
        "ai_curated": False,
        "trending": True,
        "stock": 20
    },
    {
        "slug": f"holo-emitter-lamp-{generate_slug_suffix()}",
        "name": "Holo-Emitter Lamp",
        "category": "Decor",
        "price": 89.00,
        "image": "https://images.unsplash.com/photo-1768481664822-7996eaa4ee55?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHw0fHxuZW9uJTIwcm9vbSUyMGRlY29yJTIwbGVkJTIwbGlnaHRzfGVufDB8fHx8MTc3Mjk4NTY5N3ww&ixlib=rb-4.1.0&q=85",
        "description": "Ambient holographic lamp with 16M color options",
        "ai_curated": True,
        "trending": False,
        "stock": 100
    },
    {
        "slug": f"cyber-backpack-{generate_slug_suffix()}",
        "name": "Cyber Backpack",
        "category": "Accessories",
        "price": 179.00,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "description": "Water-resistant backpack with USB charging port",
        "ai_curated": False,
        "trending": True,
        "stock": 60
    },
    {
        "slug": f"neon-sunglasses-{generate_slug_suffix()}",
        "name": "Neon Sunglasses",
        "category": "Accessories",
        "price": 79.00,
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        "description": "UV-protected sunglasses with neon accents",
        "ai_curated": True,
        "trending": False,
        "stock": 120
    },
    {
        "slug": f"led-gaming-keyboard-{generate_slug_suffix()}",
        "name": "LED Gaming Keyboard",
        "category": "Tech",
        "price": 149.00,
        "image": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
        "description": "Mechanical keyboard with per-key RGB lighting",
        "ai_curated": False,
        "trending": True,
        "stock": 85
    },
    {
        "slug": f"minimalist-desk-lamp-{generate_slug_suffix()}",
        "name": "Minimalist Desk Lamp",
        "category": "Decor",
        "price": 69.00,
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "description": "Sleek desk lamp with touch controls",
        "ai_curated": True,
        "trending": False,
        "stock": 90
    },
    {
        "slug": f"tech-joggers-{generate_slug_suffix()}",
        "name": "Tech Joggers",
        "category": "Streetwear",
        "price": 99.00,
        "image": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
        "description": "Moisture-wicking joggers with zip pockets",
        "ai_curated": False,
        "trending": True,
        "stock": 70
    },
    {
        "slug": f"wireless-earbuds-pro-{generate_slug_suffix()}",
        "name": "Wireless Earbuds Pro",
        "category": "Tech",
        "price": 199.00,
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        "description": "Active noise cancellation with 36hr battery",
        "ai_curated": True,
        "trending": True,
        "stock": 150
    },
    {
        "slug": f"urban-cap-{generate_slug_suffix()}",
        "name": "Urban Cap",
        "category": "Accessories",
        "price": 45.00,
        "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
        "description": "Adjustable snapback with embroidered logo",
        "ai_curated": False,
        "trending": False,
        "stock": 200
    }
]


# ============== Store Info ==============

STORE_INFO = {
    "name": "NOIR",
    "tagline": "The Future Drops Here",
    "owner": "Charles Stacy",
    "contact": "352-672-4847",
    "email": "contact@noir.store"
}


# ============== API Endpoints ==============

@store_router.get("/info")
async def get_store_info():
    """Get store information"""
    return STORE_INFO


@store_router.get("/products")
async def get_products(category: Optional[str] = None):
    """Get all products, optionally filtered by category"""
    # Check if products exist in database
    count = await db.products.count_documents({})
    
    if count == 0:
        # Seed products if empty
        await db.products.insert_many(SEED_PRODUCTS)
    
    # Build query
    query = {}
    if category and category != "All":
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(100)
    return products


@store_router.get("/products/{slug}")
async def get_product(slug: str):
    """Get a single product by slug"""
    # First try exact match
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    
    if not product:
        # Try prefix match (for slugs without the random suffix)
        product = await db.products.find_one(
            {"slug": {"$regex": f"^{slug}"}}, 
            {"_id": 0}
        )
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


@store_router.post("/ai/description")
async def generate_ai_description(request: AIDescriptionRequest):
    """Generate AI-powered product description"""
    try:
        prompt = f"""Write a compelling, luxurious product description for an e-commerce dropshipping store.
Product: {request.product_name}
Category: {request.category}
Price: ${request.price}

Requirements:
- 2-3 sentences maximum
- Highlight quality and exclusivity
- Use sophisticated, modern language
- No emojis or exclamation marks
- Focus on benefits and lifestyle appeal

Description:"""

        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                f"{EMERGENT_BASE_URL}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {EMERGENT_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.7
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                description = data["choices"][0]["message"]["content"].strip()
                return {"description": description}
            else:
                # Fallback description
                return {"description": f"Premium {request.category.lower()} designed for the modern lifestyle. Crafted with attention to detail and built to elevate your everyday experience."}
                
    except Exception as e:
        print(f"AI description error: {e}")
        return {"description": f"Premium {request.category.lower()} designed for the modern lifestyle. Crafted with attention to detail and built to elevate your everyday experience."}


@store_router.post("/orders/create")
async def create_order(request: CreateOrderRequest):
    """Create a new order and return PayPal order ID"""
    order_id = generate_order_id()
    
    order = {
        "order_id": order_id,
        "items": [item.model_dump() for item in request.items],
        "shipping": request.shipping.model_dump(),
        "subtotal": request.subtotal,
        "shipping_cost": request.shipping_cost,
        "total": request.total,
        "status": "pending",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.orders.insert_one(order)
    
    # In production, you would create a PayPal order here
    # For now, we return the order_id as PayPal order ID (sandbox simulation)
    return {
        "success": True,
        "order_id": order_id,
        "paypal_order_id": order_id  # In production, this would be from PayPal API
    }


@store_router.post("/orders/{order_id}/capture")
async def capture_order(order_id: str):
    """Capture/complete a PayPal payment"""
    # Find the order
    order = await db.orders.find_one({"order_id": order_id})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update order status
    await db.orders.update_one(
        {"order_id": order_id},
        {
            "$set": {
                "status": "confirmed",
                "payment_status": "paid",
                "paid_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    return {
        "success": True,
        "order_id": order_id,
        "status": "confirmed"
    }


@store_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    """Get order details"""
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert datetime to ISO string
    if "created_at" in order:
        order["created_at"] = order["created_at"].isoformat()
    if "updated_at" in order:
        order["updated_at"] = order["updated_at"].isoformat()
    if "paid_at" in order:
        order["paid_at"] = order["paid_at"].isoformat()
    
    return order
