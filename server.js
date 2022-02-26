import express from 'express';
import bodyParser from 'body-parser';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const deals = require('./deals.json');
const dealDetails = require('./deal-details.json');
const port = 3000;

const searchDeals = (searchTerm) => {
    return deals.filter((deal) => {
        for (prop in deal) {
            if (deal[prop].includes(searchTerm)) {
                return true;
            }
        }
        return false;
    });
}

const app = express();
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get(['/api/deals', '/deals'], (req, res) => {
    const { searchTerm } = req.query;
    if (searchTerm) {
        res.send(JSON.stringify(searchDeals(searchTerm)))
    }
    else {
        res.send(JSON.stringify(deals));
    }
});

app.get(['/api/deals/:id', '/deals/:id'], (req, res) => {
    console.log(req.params.id);
    const dealDetail = dealDetails[req.params.id];
    res.send(JSON.stringify(dealDetail));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})