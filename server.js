const express = require('express');
const cors = require('cors');
const { saveProductClick } = require('./database');
const { fetchProductsFromShopify } = require('./shopify');


const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// Root route to confirm server status
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Save a product click to the database
app.post('/click', async (req, res) => {
    const { title, tags, image } = req.body;
    console.log('Product click received:', { title, tags, image });

    try {
        await saveProductClick(title, tags, image);
        res.status(200).send('Product click saved successfully');
    } catch (error) {
        console.error('Error saving product click:', error.message);
        res.status(500).send('Error saving product click');
    }
});

app.post('/recommendations', async (req, res) => {
    const { tags } = req.body;
    console.log('Tags received for recommendations:', tags);
    
    try {
        // 1. Fetch recommendations from Shopify
        const shopifyProducts = await fetchProductsFromShopify();

        // Filter products based on tags
        const shopifyRecommendations = shopifyProducts.filter(product => {
            const productTags = typeof product.tags === 'string' ? product.tags.split(',') : product.tags;
            return Array.isArray(productTags) && productTags.some(tag => tags.includes(tag.trim()));
        });

        // Limit recommendations to 6
        const limitedRecommendations = shopifyRecommendations.slice(0, 9);
        
        res.json(limitedRecommendations);

    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        res.status(500).send('Error fetching recommendations');
    }
});





// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
