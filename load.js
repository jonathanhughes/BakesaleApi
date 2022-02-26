import fetch from 'node-fetch';
import fs from 'fs';

const bakesaleBaseUrl = 'https://bakesaleforgood.com';
const bakesaleDealsApi = `${bakesaleBaseUrl}/api/deals`;
const localUrl = 'http://localhost:3000';

const cleanupUrls = (deal) => {
    if (typeof deal === "string") {
        return deal.replace(bakesaleBaseUrl, localUrl);
    }
    else {
        for (let prop in deal) {
            if (typeof prop === "string") {
                if (Array.isArray(deal[prop])) {
                    deal[prop] = deal[prop].map(cleanupUrls);
                }
                else {
                    deal[prop] = cleanupUrls(deal[prop]);
                }
            }
        }
    }
    return deal
};

const load = async () => {
    const dealsResponse = await fetch(bakesaleDealsApi);
    const rawDeals = await dealsResponse.json();  // =D
    const dealDetails = {};

    const deals = await Promise.all(rawDeals.map(async (deal) => {
        const dealDetailResponse = await fetch(`${bakesaleDealsApi}/${deal.key}`);
        const dealDetail = await dealDetailResponse.json();
        dealDetails[dealDetail.key] = cleanupUrls(dealDetail);
        return cleanupUrls(deal);
    }));

    fs.writeFile('./deals.json', JSON.stringify(deals, null, 4), (err) => {
        if (err) throw err;
        console.log('Deals file has been saved!');
    });

    fs.writeFile('./deal-details.json', JSON.stringify(dealDetails, null, 4), (err) => {
        if (err) throw err;
        console.log('Deal details file has been saved!');
    });

};

load();