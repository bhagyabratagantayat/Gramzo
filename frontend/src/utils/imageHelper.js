/**
 * Utility to get high-quality relevant images for products and services.
 * Uses Unsplash Source for dynamic keyword-based images.
 */

const keywordMap = {
    vegetable: 'vegetables,farm',
    fruit: 'fruits,fresh',
    electronics: 'gadgets,technology',
    mobile: 'smartphone,mobile',
    shirt: 'clothing,fashion',
    dress: 'fashion,apparel',
    realestate: 'house,property',
    land: 'field,landscape',
    repairs: 'tools,repair',
    salon: 'beauty,spa',
    spa: 'wellness,massage',
    grocery: 'grocery,supermarket',
    food: 'delicious,food',
    seeds: 'seeds,agriculture',
    fertilizer: 'farmer,plants',
    hardware: 'tools,construction',
    furniture: 'home,furniture',
    cleaning: 'cleaning,service',
    delivery: 'logistics,delivery',
    plumbing: 'plumber,work',
    electrical: 'electrician,wiring',
    education: 'learning,books',
    health: 'medical,healthcare'
};

/**
 * Returns a relevant image URL based on item name and category.
 * @param {string} name - Name of the item
 * @param {string} category - Category of the item
 * @returns {string} - Unsplash image URL
 */
export const getFallbackImage = (name = '', category = '') => {
    const input = `${name} ${category}`.toLowerCase();
    let searchKeyword = 'marketplace';

    // Check for specific keywords in the input
    for (const [key, search] of Object.entries(keywordMap)) {
        if (input.includes(key)) {
            searchKeyword = search;
            break;
        }
    }

    // If no specific match, use the category itself or the name
    if (searchKeyword === 'marketplace') {
        searchKeyword = category || name || 'village,market';
    }

    // Use LoremFlickr for reliable high quality dynamic images
    // We use the first keyword from our search keyword string
    const keyword = searchKeyword.split(',')[0];
    const randomSeed = Math.floor(Math.random() * 1000);
    return `https://loremflickr.com/400/300/${encodeURIComponent(keyword)}?lock=${randomSeed}`;
};

export const defaultPlaceholder = "https://loremflickr.com/400/300/market?lock=1";
