const axios = require('axios');

const fetchProductsFromShopify = async () => {
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyStoreUrl = process.env.SHOPIFY_STORE_URL;
    const endpoint = `${shopifyStoreUrl}/admin/api/2024-10/products.json`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                'X-Shopify-Access-Token': shopifyAccessToken,
                'Content-Type': 'application/json'
            }
        });

        // Filter the products to include only relevant information
        const products = response.data.products.map(product => ({
            id: product.id,
            title: product.title,
            tags: product.tags.split(',').map(tag => tag.trim()), // Convert tags string to array
            image: product.image ? product.image.src : null, // Ensure an image exists
            price: product.variants && product.variants[0] ? product.variants[0].price : null // Get price of first variant
        }));

        return products;
    } catch (error) {
        console.error('Error fetching products from Shopify:', error.message);
        throw error;
    }
};


module.exports = { fetchProductsFromShopify };
