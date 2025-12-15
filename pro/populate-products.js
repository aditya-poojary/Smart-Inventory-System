const axios = require('axios');
require('dotenv').config();

// Fynd Platform API Configuration
const ORGANIZATION_ID = process.env.FYND_ORGANIZATION_ID;
const COMPANY_ID = process.env.FYND_COMPANY_ID;
const API_BASE = process.env.FYND_API_BASE || 'https://api.fynd.com';
const AUTH_TOKEN = process.env.FYND_AUTH_TOKEN;

// Product data based on your inventory system
const products = [
    {
        name: "Coca-Cola Soft Drink PET Bottle 750ml",
        brand: "Coca-Cola",
        category: "Beverages",
        item_code: "BEV-COC-750",
        description: "Refreshing Coca-Cola soft drink in PET bottle",
        price: 40.00,
        size: "750ml",
        department: "Food & Beverages"
    },
    {
        name: "Coca-Cola Zero Sugar Soft Drink PET Bottle 750ml",
        brand: "Coca-Cola",
        category: "Beverages",
        item_code: "BEV-COCZ-750",
        description: "Zero sugar Coca-Cola variant",
        price: 40.00,
        size: "750ml",
        department: "Food & Beverages"
    },
    {
        name: "Thums Up Soft Drink PET Bottle 750ml",
        brand: "Thums Up",
        category: "Beverages",
        item_code: "BEV-THUMSUP-750",
        description: "Bold and refreshing cola drink",
        price: 40.00,
        size: "750ml",
        department: "Food & Beverages"
    },
    {
        name: "Lay's Potato Chips Classic Salted 52g Pouch",
        brand: "Lay's",
        category: "Snacks",
        item_code: "SNK-LAYS-CLSC-52",
        description: "Crispy potato chips with classic salted flavor",
        price: 20.00,
        size: "52g",
        department: "Snacks"
    },
    {
        name: "MAGGI 2-Minute Masala Instant Noodles 70g Pouch",
        brand: "MAGGI",
        category: "Instant Foods",
        item_code: "INST-MAGGI-MAS-70",
        description: "Quick and tasty masala noodles",
        price: 12.00,
        size: "70g",
        department: "Instant Foods"
    },
    {
        name: "MAGGI Special Masala Instant Noodles 70g Pouch",
        brand: "MAGGI",
        category: "Instant Foods",
        item_code: "INST-MAGGI-SPC-70",
        description: "Special masala variant instant noodles",
        price: 14.00,
        size: "70g",
        department: "Instant Foods"
    },
    {
        name: "Cadbury Dairy Milk Silk Chocolate Bar 60g",
        brand: "Cadbury",
        category: "Confectionery",
        item_code: "CONF-SILK-PLN-60",
        description: "Premium milk chocolate with smooth texture",
        price: 85.00,
        size: "60g",
        department: "Confectionery"
    },
    {
        name: "Cadbury Dairy Milk Silk Hazelnut Chocolate Bar 58g",
        brand: "Cadbury",
        category: "Confectionery",
        item_code: "CONF-SILK-HAZ-58",
        description: "Silk chocolate with crunchy hazelnuts",
        price: 90.00,
        size: "58g",
        department: "Confectionery"
    },
    {
        name: "Parle-G Gold Biscuits 1kg Pack",
        brand: "Parle",
        category: "Biscuits",
        item_code: "BISC-PARLEG-1000",
        description: "Classic glucose biscuits family pack",
        price: 80.00,
        size: "1kg",
        department: "Snacks"
    },
    {
        name: "Britannia Good Day Butter Cookies 100g",
        brand: "Britannia",
        category: "Biscuits",
        item_code: "BISC-GDDAY-100",
        description: "Delicious butter cookies",
        price: 30.00,
        size: "100g",
        department: "Snacks"
    },
    {
        name: "Amul Fresh Milk Full Cream 500ml",
        brand: "Amul",
        category: "Dairy",
        item_code: "DAIRY-MILK-500",
        description: "Fresh full cream milk",
        price: 28.00,
        size: "500ml",
        department: "Dairy"
    },
    {
        name: "Amul Butter 100g Pack",
        brand: "Amul",
        category: "Dairy",
        item_code: "DAIRY-BUTTER-100",
        description: "Pure butter spread",
        price: 55.00,
        size: "100g",
        department: "Dairy"
    },
    {
        name: "Pepsi Soft Drink PET Bottle 750ml",
        brand: "Pepsi",
        category: "Beverages",
        item_code: "BEV-PEPSI-750",
        description: "Refreshing Pepsi cola drink",
        price: 40.00,
        size: "750ml",
        department: "Food & Beverages"
    },
    {
        name: "Mountain Dew Soft Drink 750ml",
        brand: "Mountain Dew",
        category: "Beverages",
        item_code: "BEV-DEW-750",
        description: "Citrus flavored soft drink",
        price: 40.00,
        size: "750ml",
        department: "Food & Beverages"
    },
    {
        name: "Kurkure Masala Munch 90g",
        brand: "Kurkure",
        category: "Snacks",
        item_code: "SNK-KURKURE-90",
        description: "Crunchy masala snack",
        price: 20.00,
        size: "90g",
        department: "Snacks"
    }
];

async function createProduct(product) {
    try {
        const payload = {
            name: product.name,
            brand: {
                name: product.brand
            },
            category: {
                name: product.category
            },
            departments: [product.department],
            item_code: product.item_code,
            description: product.description,
            sizes: [
                {
                    size: product.size,
                    price: product.price * 1.3, // Cost price
                    price_effective: product.price, // Selling price
                    currency: "INR",
                    seller_identifier: product.item_code
                }
            ],
            is_active: true,
            slug: product.item_code.toLowerCase()
        };

        const response = await axios.post(
            `${API_BASE}/service/platform/catalog/v1.0/company/${COMPANY_ID}/products`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                    'x-fp-cli': '8.0.4'
                }
            }
        );

        console.log(`✓ Created: ${product.name}`);
        return response.data;
    } catch (error) {
        console.error(`✗ Failed to create ${product.name}:`, error.response?.data?.message || error.message);
        return null;
    }
}

async function populateProducts() {
    console.log('=================================================');
    console.log('  Populating Fynd Platform with Products');
    console.log('=================================================');
    console.log(`Company ID: ${COMPANY_ID}`);
    console.log(`Total Products: ${products.length}`);
    console.log('=================================================\n');

    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        const result = await createProduct(product);
        if (result) {
            successCount++;
        } else {
            failCount++;
        }
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=================================================');
    console.log('  Population Complete');
    console.log('=================================================');
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log(`Total: ${products.length}`);
    console.log('=================================================');
    console.log(`\nView products: https://platform.fynd.com/company/${COMPANY_ID}/products/list`);
}

// Run the script
populateProducts().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});
