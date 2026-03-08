#!/usr/bin/env python3
"""
NOIR Dropshipping Store Backend API Tests
Tests all store endpoints including AI description generation
"""

import requests
import sys
import json
from datetime import datetime

class StoreAPITester:
    def __init__(self, base_url="https://moltbot-setup-5004.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}, Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'List with ' + str(len(response_data)) + ' items'}"
                except:
                    details = f"Status: {response.status_code}"
            else:
                details = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_data = response.json()
                    details += f", Error: {error_data}"
                except:
                    details += f", Text: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            return success, response.json() if success and response.content else {}

        except requests.exceptions.Timeout:
            self.log_test(name, False, f"Request timed out after {timeout}s")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_store_info(self):
        """Test store information endpoint"""
        success, response = self.run_test(
            "Store Info",
            "GET", 
            "/api/store/info",
            200
        )
        if success:
            expected_keys = ['name', 'owner', 'contact']
            missing_keys = [key for key in expected_keys if key not in response]
            if missing_keys:
                self.log_test("Store Info - Structure", False, f"Missing keys: {missing_keys}")
            elif response.get('owner') == 'Charles Stacy' and response.get('contact') == '352-672-4847':
                self.log_test("Store Info - Content", True, "Owner and contact info correct")
            else:
                self.log_test("Store Info - Content", False, f"Incorrect owner/contact: {response}")
        return success

    def test_get_all_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get All Products",
            "GET",
            "/api/store/products", 
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            # Check first product structure
            product = response[0]
            expected_fields = ['slug', 'name', 'category', 'price', 'image']
            missing_fields = [field for field in expected_fields if field not in product]
            if missing_fields:
                self.log_test("Product Structure", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Product Structure", True, f"All required fields present")
                
            # Check categories
            categories = set(p.get('category') for p in response)
            expected_categories = {'Tech', 'Streetwear', 'Footwear', 'Accessories', 'Decor'}
            if expected_categories.issubset(categories):
                self.log_test("Product Categories", True, f"Found categories: {categories}")
            else:
                self.log_test("Product Categories", False, f"Missing categories: {expected_categories - categories}")
                
            return True, response
        return False, []

    def test_category_filter(self):
        """Test category filtering"""
        success, response = self.run_test(
            "Filter by Tech Category",
            "GET",
            "/api/store/products?category=Tech",
            200
        )
        
        if success and isinstance(response, list):
            tech_products = [p for p in response if p.get('category') == 'Tech']
            if len(tech_products) == len(response):
                self.log_test("Category Filter - Tech Only", True, f"All {len(response)} products are Tech")
            else:
                self.log_test("Category Filter - Tech Only", False, f"Found non-Tech products in Tech filter")
        return success

    def test_get_single_product(self, products):
        """Test getting a single product"""
        if not products:
            self.log_test("Single Product - No Products Available", False, "No products to test")
            return False
            
        # Use first product for testing
        test_product = products[0]
        slug = test_product.get('slug')
        
        success, response = self.run_test(
            f"Get Single Product - {slug}",
            "GET",
            f"/api/store/products/{slug}",
            200
        )
        
        if success:
            if response.get('slug') == slug:
                self.log_test("Single Product - Match", True, "Correct product returned")
            else:
                self.log_test("Single Product - Match", False, "Wrong product returned")
        return success

    def test_ai_description(self, products):
        """Test AI description generation"""
        if not products:
            self.log_test("AI Description - No Products Available", False, "No products to test")
            return False
            
        # Use first product for testing
        test_product = products[0]
        
        success, response = self.run_test(
            "AI Description Generation",
            "POST",
            "/api/store/ai/description",
            200,
            data={
                "product_name": test_product.get('name'),
                "category": test_product.get('category'), 
                "price": test_product.get('price')
            },
            timeout=45  # AI calls can be slower
        )
        
        if success and 'description' in response:
            description = response['description']
            if len(description) > 20:  # Basic sanity check
                self.log_test("AI Description - Content", True, f"Generated description: {description[:100]}...")
            else:
                self.log_test("AI Description - Content", False, "Description too short")
        return success

    def test_order_creation(self, products):
        """Test order creation"""
        if not products:
            self.log_test("Order Creation - No Products Available", False, "No products to test")
            return False, None
            
        test_product = products[0]
        
        success, response = self.run_test(
            "Create Order",
            "POST",
            "/api/store/orders/create",
            200,
            data={
                "items": [{
                    "slug": test_product.get('slug'),
                    "quantity": 1,
                    "price": test_product.get('price')
                }],
                "shipping": {
                    "email": "test@example.com",
                    "firstName": "Test",
                    "lastName": "User", 
                    "address": "123 Test St",
                    "city": "Test City",
                    "state": "TS",
                    "zipCode": "12345",
                    "country": "US"
                },
                "subtotal": test_product.get('price'),
                "shipping_cost": 9.99,
                "total": test_product.get('price') + 9.99
            }
        )
        
        if success and 'order_id' in response:
            order_id = response['order_id']
            if order_id.startswith('NOIR-'):
                self.log_test("Order ID Format", True, f"Correct format: {order_id}")
            else:
                self.log_test("Order ID Format", False, f"Incorrect format: {order_id}")
            return True, order_id
        return False, None

    def test_order_capture(self, order_id):
        """Test order capture/payment"""
        if not order_id:
            self.log_test("Order Capture - No Order ID", False, "No order ID to test")
            return False
            
        success, response = self.run_test(
            "Capture Order Payment",
            "POST", 
            f"/api/store/orders/{order_id}/capture",
            200
        )
        
        if success and response.get('success') == True:
            self.log_test("Order Capture - Success", True, "Order captured successfully")
        return success

def main():
    print("🚀 Starting NOIR Dropshipping Store API Tests")
    print("=" * 60)
    
    tester = StoreAPITester()
    
    # Test store info
    tester.test_store_info()
    
    # Test products endpoints
    products_success, products = tester.test_get_all_products()
    
    if products_success:
        tester.test_category_filter()
        tester.test_get_single_product(products)
        tester.test_ai_description(products)
        
        # Test order flow
        order_success, order_id = tester.test_order_creation(products)
        if order_success:
            tester.test_order_capture(order_id)
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Test Summary: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())