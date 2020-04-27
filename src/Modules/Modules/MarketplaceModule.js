const GModule = require("../GModule");
const ItemShow = require("../../Drawings/ItemShow");
const Marketplace = require("../../Drawings/Marketplace");
const Globals = require("../../Globals");

class MarketplaceModule extends GModule {
    constructor() {
        super();
        this.commands = ["mkmylist", "mkplace", "mkcancel", "mkbuy", "mksearch", "mkshow", "mksee"];
        this.startLoading("Marketplace");
        this.init();
        this.endLoading("Marketplace");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let data;
        let searchFilters = this.getSearchFilters(args);
        switch (command) {
            case "mkmylist":
                data = await axios.get("/game/marketplace/mylist/" + args[0], { params: searchFilters.params });
                data = data.data;
                if (data.error == null) {
                    msg = Marketplace.toString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "mkplace":
                data = await axios.post("/game/marketplace/place", {
                    idItem: args[0],
                    number: args[1],
                    price: args[2],
                    forced: args[3],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "mkcancel":
                data = await axios.post("/game/marketplace/cancel", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "mkbuy":
                data = await axios.post("/game/marketplace/buy", {
                    idItem: args[0],
                    number: args[1],
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;


            case "mksearch":
            case "mkshow":
                data = await axios.get("/game/marketplace/show/" + searchFilters.page, { params: searchFilters.params });
                data = data.data;
                if (data.error == null) {
                    msg = Marketplace.toString(data);
                } else {
                    msg = data.error;
                }
                break;

            case "mksee":
                data = await axios.get("/game/marketplace/show/item/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    msg = ItemShow.showItem(data);
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = MarketplaceModule;