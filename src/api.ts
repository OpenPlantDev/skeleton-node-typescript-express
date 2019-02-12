import express from "express";

export class Api {

    Start (): void {
        const api = express();
        // this replaces using body-parser in express 4.16
        api.use(express.urlencoded({extended: true}));
        //api.use(bodyParser.json()); // support json encoded bodies
        //api.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        api.get("/api", (req, res) => {
            return res.send("Hello from the API");

        });

        // Start the server

        const port = process.env.PORT || 3000;

        api.listen(port, () => {
            console.log(`Api is listening on http://localhost:${port}`);
        });


    }
}
