const GModule = require("../GModule");
const Globals = require("../../Globals");
const Translator = require("../../Translator/Translator");
const ItemShow = require("../../Drawings/ItemShow");
const Inventory = require("../../Drawings/Inventory");
const Emojis = require("../../Drawings/Emojis");
const Discord = require("discord.js");


class InventoryModule extends GModule {
    constructor() {
        super();
        this.commands = ["item", "itemfav", "itemunfav", "inv", "inventory", "sell", "sellall", "sendmoney"];
        this.startLoading("Inventory");
        this.init();
        this.endLoading("Inventory");
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} command
     * @param {Array} args
     */
    async run(message, command, args) {
        let msg = "";
        let mentions = message.mentions.users;
        let firstMention;
        let data;
        let axios = Globals.connectedUsers[message.author.id].getAxios();
        let searchFilters;

        switch (command) {
            case "item":
                data = await axios.get("/game/inventory/item/" + args[0]);
                data = data.data;
                if (data.error == null) {
                    let itemmsg;
                    if (data.equippedStats != null) {
                        itemmsg = ItemShow.showInInventoryItem(data);
                    } else {
                        itemmsg = ItemShow.showEquippedItem(data);
                    }

                    let isEquipped = isNaN(parseInt(args[0]));
                    let sellEmoji = Emojis.getID("money_bag");
                    let equipUnequipEmoji = isEquipped ? Emojis.getID("backpack") : Emojis.getID("shield");
                    let favoEmoji = data.item.isFavorite == false ? Emojis.getID("star") : Emojis.getID("eight_pointed_black_star");
                    let addToTradeEmoji = Emojis.getID("baggage_claim");

                    // See if he is trading
                    let isTrading = await axios.get("/game/character/isTrading");
                    isTrading = isTrading.data;
                    isTrading = isTrading.error == null ? isTrading.isTrading : false;

                    let itemmsgsent = await message.channel.send(itemmsg);

                    Promise.all([
                        data.item.isFavorite == true ? null : (isEquipped ? null : itemmsgsent.react(sellEmoji)),
                        itemmsgsent.react(favoEmoji),
                        data.item.equipable == true ? itemmsgsent.react(equipUnequipEmoji) : null,
                        isTrading == true ? itemmsgsent.react(addToTradeEmoji) : null
                    ]).catch(() => null);

                    const filter = (reaction, user) => {
                        return [sellEmoji, favoEmoji, equipUnequipEmoji, addToTradeEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    const collector = itemmsgsent.createReactionCollector(filter, {
                        time: 22000,
                        max: 3,
                    });

                    collector.on('collect', async (reaction) => {
                        let dataCollector;
                        let msgCollector = null;

                        switch (reaction.emoji.name) {
                            case equipUnequipEmoji:
                                if (isEquipped) {
                                    dataCollector = await axios.post("/game/equipment/unequip", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                } else {
                                    dataCollector = await axios.post("/game/equipment/equip", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                }
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                            case sellEmoji:
                                dataCollector = await axios.post("/game/inventory/sell", {
                                    idItem: data.item.id,
                                    number: 1,
                                    isRealID: true,
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }

                                break;

                            case favoEmoji:
                                if (data.item.isFavorite == false) {
                                    dataCollector = await axios.post("/game/inventory/itemfav", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                } else {
                                    dataCollector = await axios.post("/game/inventory/itemunfav", {
                                        idItem: data.item.id,
                                        isRealID: true,
                                    });
                                }
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = dataCollector.success;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                            case addToTradeEmoji:
                                if (this.allModulesReference["TradeModule"] != null) {
                                    this.allModulesReference["TradeModule"].run(message, "tadd", [data.idInInventory, data.item.number]);
                                }
                                break;
                        }
                        if (msgCollector != null) {
                            await this.sendMessage(message, msgCollector);
                        }

                    });

                    collector.on('end', async (reactions, reason) => {
                        if (!itemmsgsent.deleted && message.channel.type != "dm") {
                            itemmsgsent.reactions.removeAll();
                        }
                    });
                } else {
                    msg = data.error;
                }
                break;

            case "itemfav":
                data = await axios.post("/game/inventory/itemfav", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "itemunfav":
                data = await axios.post("/game/inventory/itemunfav", {
                    idItem: args[0]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;

            case "inv":
            case "inventory":
                searchFilters = this.getSearchFilters(args);

                data = await axios.get("/game/inventory/show/" + searchFilters.page, {
                    params: searchFilters.params
                });
                data = data.data;
                if (data.error == null) {
                    let inventoryMessage = await message.channel.send(Inventory.ciDisplay(data));
                    let isDM = message.channel.type == "dm";
                    var invCurrentPage = data.page;
                    let currentMessageReactions = [];

                    let nextEmoji = Emojis.getString("right_arrow");
                    let backEmoji = Emojis.getString("left_arrow");

                    if (inventoryMessage == null) {
                        break;
                    }

                    if (!inventoryMessage.deleted) {
                        if (data.page > 1) {
                            currentMessageReactions.push(await inventoryMessage.react(backEmoji));
                        }
                        if (data.page < data.maxPage) {
                            currentMessageReactions.push(await inventoryMessage.react(nextEmoji));
                        }
                    }


                    const filter = (reaction, user) => {
                        return [nextEmoji, backEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    const collectorInventory = inventoryMessage.createReactionCollector(filter, {
                        time: 60000,
                    });

                    collectorInventory.on('collect', async (reaction, user) => {
                        let dataCollector;
                        let msgCollector = null;
                        switch (reaction.emoji.name) {
                            case nextEmoji:
                                dataCollector = await axios.get("/game/inventory/show/" + (invCurrentPage + 1), {
                                    params: searchFilters.params
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = Inventory.ciDisplay(dataCollector);
                                    invCurrentPage++;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                            case backEmoji:
                                dataCollector = await axios.get("/game/inventory/show/" + (invCurrentPage - 1), {
                                    params: searchFilters.params
                                });
                                dataCollector = dataCollector.data;
                                if (dataCollector.error == null) {
                                    msgCollector = Inventory.ciDisplay(dataCollector);
                                    invCurrentPage--;
                                } else {
                                    msgCollector = dataCollector.error;
                                }
                                break;
                        }
                        if (msgCollector != null && !inventoryMessage.deleted) {
                            if (isDM) {
                                for (let i in currentMessageReactions) {
                                    currentMessageReactions[i] = currentMessageReactions[i].remove();
                                }
                                await Promise.all(currentMessageReactions);
                                currentMessageReactions = [];
                            } else {
                                await inventoryMessage.reactions.removeAll();
                            }
                            await inventoryMessage.edit(msgCollector);
                            if (dataCollector.error == null) {
                                if (dataCollector.page > 1) {
                                    currentMessageReactions.push(await inventoryMessage.react(backEmoji));
                                }
                                if (dataCollector.page < dataCollector.maxPage) {
                                    currentMessageReactions.push(await inventoryMessage.react(nextEmoji));
                                }
                            }
                        }

                    });

                    collectorInventory.on('end', async (reactions, reason) => {
                        if (!inventoryMessage.deleted) {
                            if (!isDM) {
                                inventoryMessage.reactions.removeAll();
                            } else {
                                for (let i in currentMessageReactions) {
                                    if (typeof currentMessageReactions[i].remove === "function") {
                                        currentMessageReactions[i] = currentMessageReactions[i].remove();
                                    }
                                }
                            }
                        }
                    });

                } else {
                    msg = data.error;
                }
                break;

            case "sell":
                data = await axios.post("/game/inventory/sell", {
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

            case "sellall":
                searchFilters = this.getSearchFilters(args);

                var paramsSellAll = searchFilters.params;
                var dataInventoryValue = await axios.post("/game/inventory/sellall/value", paramsSellAll);
                dataInventoryValue = dataInventoryValue.data;

                if (dataInventoryValue.error == null) {
                    if (dataInventoryValue.value > 0) {
                        let sellAllConfirmation = await message.channel.send(Inventory.ciValueSellAllDisplay(dataInventoryValue, paramsSellAll)).catch(e => null);
                        let checkEmoji = Emojis.getID("vmark");
                        let xmarkEmoji = Emojis.getID("xmark");

                        Promise.all([
                            sellAllConfirmation.react(checkEmoji),
                            sellAllConfirmation.react(xmarkEmoji)
                        ]).catch(() => null);

                        const filter = (reaction, user) => {
                            return [checkEmoji, xmarkEmoji].includes(reaction.emoji.id) && user.id === message.author.id;
                        };


                        const collected = await sellAllConfirmation.awaitReactions(filter, {
                            max: 1,
                            time: 25000
                        });
                        const reaction = collected.first();
                        if (reaction != null) {
                            switch (reaction.emoji.id) {
                                case checkEmoji:
                                    data = await axios.post("/game/inventory/sellall", paramsSellAll);
                                    data = data.data;
                                    if (data.error == null) {
                                        msg = data.success;
                                    } else {
                                        msg = data.error;
                                    }
                                    break;

                                case xmarkEmoji:
                                    msg = Translator.getString(dataInventoryValue.lang, "inventory_equipment", "sellall_cancel");
                                    break;
                            }
                        }
                        sellAllConfirmation.delete().catch(() => null);
                    } else {
                        msg = Translator.getString(dataInventoryValue.lang, "errors", "economic_cant_sell_nothing");
                    }
                } else {
                    msg = dataInventoryValue.error;
                }
                break;

            case "sendmoney":
                firstMention = mentions.first();
                var isMention = false;
                var mId = 0;
                if (firstMention) {
                    args[0] = firstMention.id;
                    isMention = true;
                }
                data = await axios.post("/game/inventory/sendmoney", {
                    id: args[0],
                    isMention: isMention,
                    amount: args[1]
                });
                data = data.data;
                if (data.error == null) {
                    msg = data.success;
                } else {
                    msg = data.error;
                }
                break;
        }

        this.sendMessage(message, msg);
    }
}

module.exports = InventoryModule;
