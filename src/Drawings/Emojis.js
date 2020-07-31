const conf = require("../../conf/conf");

class Emojis {
    static getID(emojiName) {
        let em;
        if (conf.env === "prod") {
            em = Emojis.emojisProd[emojiName];
        } else {
            em = Emojis.emojisDev[emojiName];
            em = em != null ? em : Emojis.emojisProd[emojiName];
        }
        return em != null ? em.id : Emojis.general[emojiName];
    }

    static getString(emojiName) {
        let em;
        if (conf.env === "prod") {
            em = Emojis.emojisProd[emojiName];
        } else {
            em = Emojis.emojisDev[emojiName];
            em = em != null ? em : Emojis.emojisProd[emojiName];
        }
        return em != null ? em.string : Emojis.general[emojiName];
    }

    static getWeatherEmoji(weatherShorthand) {
        if (Emojis.weather[weatherShorthand]) {
            return Emojis.getString(Emojis.weather[weatherShorthand]);
        } else {
            return Emojis.getString("thermometer");
        }
    }

    static getItemTypeEmoji(typeShorthand) {
        return Emojis.typeItem[typeShorthand] ? Emojis.typeItem[typeShorthand] : Emojis.general.q_mark;
    }

    static getRarityEmoji(rarityShorthand) {
        return Emojis.getString("rarity_" + rarityShorthand);
    }

    static getItemSubTypeEmoji(subtypeShorthand) {
        return Emojis.subtypeItem[subtypeShorthand] ? Emojis.subtypeItem[subtypeShorthand] : Emojis.general.q_mark;
    }

    static getAreaTypeEmoji(typeShorthand) {
        return Emojis.areaType[typeShorthand] ? Emojis.areaType[typeShorthand] : Emojis.general.q_mark;
    }

    static getAreaBonusEmoji(bonusIdentifier) {
        return Emojis.areaBonus[bonusIdentifier] ? Emojis.areaBonus[bonusIdentifier] : Emojis.general.books;
    }

    static getResourceSubtype(subtypeShorthand, rarityShorthand) {
        let resourcesTypesEquivalent = {
            "plant": "herb"
        }

        subtypeShorthand = resourcesTypesEquivalent[subtypeShorthand] ? resourcesTypesEquivalent[subtypeShorthand] : subtypeShorthand;

        let emoji = this.getString(subtypeShorthand + "_" + rarityShorthand);

        return emoji != null ? emoji : this.getItemSubTypeEmoji(subtypeShorthand);
    }

}

Emojis.weather = {
    "sunny": "sun",
    "cloudy": "cloud",
    "foggy": "fog",
    "rainy": "rain",
    "rainstorm": "rainstorm",
    "snowy": "snow",
    "firestorm": "fire",
    "sandstorm": "tornado",
    "snowstorm": "snowflake"
};

Emojis.emojisProd = {
    "honor": {
        id: "737489069486899301",
        string: "<a:honor:737489069486899301>"
    },
    "rusty_broken_sword": {
        id: "737489070909030442",
        string: "<a:rusty_broken_sword:737489070909030442>"
    },
    "rusty_sword": {
        id: "737489071273934848",
        string: "<a:rusty_sword:737489071273934848>"
    },
    "sword2": {
        id: "737489070464434207",
        string: "<a:sword2:737489070464434207>"
    },
    "gold_sword": {
        id: "737489068832850064",
        string: "<a:gold_sword:737489068832850064>"
    },
    "monster": {
        id: "737489071403958384",
        string: "<a:monstre:737489071403958384>"
    },
    "sword": {
        id: "737489070262976552",
        string: "<a:sword:737489070262976552>"
    },
    "win": {
        id: "737489071907274763",
        string: "<a:win:737489071907274763>"
    },
    "idFRPG": {
        id: "737489070141210705",
        string: "<a:idFRPG:737489070141210705>"
    },
    "levelup": {
        id: "737489069696745605",
        string: "<a:levelup:737489069696745605>"
    },
    "exp": {
        id: "737489071605022731",
        string: "<a:exp:737489071605022731>"
    },
    "bar_white": {
        id: "737489145223577691",
        string:"<a:bar_white:737489145223577691>"
    },
    "bar_white_empty": {
        id: "737489145215188992",
        string: "<a:bar_white_empty:737489145215188992>"
    },
    "bar_red": {
        id: "737489145005473864",
        string: "<a:bar_red:737489145005473864>"
    },
    "bar_red_empty": {
        id: "737489146586726400",
        string: "<a:bar_red_empty:737489146586726400>"
    },
    "bar_blue": {
        id: "737489144200036383",
        string: "<:bar_blue:737489144200036383>"
    },
    "bar_blue_empty": {
        id: "737489144736907354",
        string: "<a:bar_blue_empty:737489144736907354>"
    },
    "bar_yellow": {
        id: "737489145609584741",
        string: "<a:bar_yellow:737489145609584741>"
    },
    "bar_yellow_empty": {
        id: "737489146653835324",
        string: "<a:bar_yellow_empty:737489146653835324>"
    },
    "bar_green": {
        id: "737489145450070218",
        string: "<a:bar_green:737489145450070218>"
    },
    "bar_green_empty": {
        id: "737489145206931537",
        string: "<a:bar_green_empty:737489145206931537>"
    },
    "treasure": {
        id: "737489072121053184",
        string: "<a:treasure:737489072121053184>"
    },
    "loose": {
        id: "737489069847609366",
        string: "<a:loose:737489069847609366>"
    },
    "elite": {
        id: "737489071890497560",
        string: "<a:elite:737489071890497560>"
    },
    "boss": {
        id: "737489067750719499",
        string: "<a:boss:737489067750719499>"
    },
    "rarity_common": {
        id: "737489072221585458",
        string: "<a:rarity_common:737489072221585458>"
    },
    "rarity_rare": {
        id: "737489070422360084",
        string: "<a:rarity_rare:737489070422360084>"
    },
    "rarity_superior": {
        id: "737489070632206397",
        string: "<a:rarity_superior:737489070632206397>"
    },
    "rarity_epic": {
        id: "737489071219277854",
        string: "<a:rarity_epic:737489071219277854>"
    },
    "rarity_legendary": {
        id: "737489071609479198",
        string: "<a:rarity_legendary:737489071609479198>"
    },
    "rarity_mythic": {
        id: "737489071399501926",
        string: "<a:rarity_mythic:737489071399501926>"
    },
    "wood_common": {
        id: "738598940433317960",
        string: "<a:wood_common:738598940433317960>"
    },
    "wood_rare": {
        id: "738598941620437034",
        string: "<a:wood_rare:738598941620437034>"
    },
    "wood_superior": {
        id: "738598941385293867",
        string: "<a:wood_superior:738598941385293867>"
    },
    "wood_epic": {
        id: "738598941603397692",
        string: "<a:wood_epic:738598941603397692>"
    },
    "wood_legendary": {
        id: "738598941402071111",
        string: "<a:wood_legendary:738598941402071111>"
    },
    "wood_mythic": {
        id: "703958796757762048",
        string: "<:wood_mythic:703958796757762048>"
    },
    "ore_common": {
        id: "738598940932571196",
        string: "<a:ore_common:738598940932571196>"
    },
    "ore_rare": {
        id: "738598940273934387",
        string: "<a:ore_rare:738598940273934387>"
    },
    "ore_superior": {
        id: "738598940513140957",
        string: "<a:ore_superior:738598940513140957>"
    },
    "ore_epic": {
        id: "738598940143910914",
        string: "<a:ore_epic:738598940143910914>"
    },
    "ore_legendary": {
        id: "738598939963686913",
        string: "<a:ore_legendary:738598939963686913>"
    },
    "ore_mythic": {
        id: "703958795574837258",
        string: "<:ore_mythic:703958795574837258>"
    },
    "herb_common": {
        id: "738598940055699536",
        string: "<a:herb_common:738598940055699536>"
    },
    "herb_rare": {
        id: "738598940781445130",
        string: "<a:herb_rare:738598940781445130>"
    },
    "herb_superior": {
        id: "738598940177596497",
        string: "<a:herb_superior:738598940177596497>"
    },
    "herb_epic": {
        id: "738598941964238889",
        string: "<a:herb_epic:738598941964238889>"
    },
    "herb_legendary": {
        id: "738598940374728764",
        string: "<a:herb_legendary:738598940374728764>"
    },
    "herb_mythic": {
        id: "703958796229148683",
        string: "<:herb_mythic:703958796229148683>"
    },
    "item_type_chest": {
        id: "737489070237810708",
        string: "<a:chest:737489070237810708>"
    },
    "item_type_legs": {
        id: "737489071663743037",
        string: "<a:legs:737489071663743037>"
    },
    "item_type_helmet": {
        id: "737489070728413194",
        string: "<a:helmet:737489070728413194>"
    },
    "item_type_resource": {
        id: "737489072699998299",
        string: "<a:resource:737489072699998299>"
    },
    "potion_empty": {
        id: "737489069147422751",
        string: "<a:potion_empty:737489069147422751>"
    },
    "item_type_lootbox": {
        id: "737489073845043280",
        string: "<a:lootbox:737489073845043280>"
    },
    "saddle": {
        id: "737489073438195824",
        string: "<a:saddle:737489073438195824>"
    },
    "reset_time_potion": {
        id: "737489071399633060",
        string: "<a:reset_time_potion:737489071399633060>"
    },
    "dungeon_door": {
        id: "737489068815810700",
        string: "<a:dungeon_door:737489068815810700>"
    },
    "leveldown": {
        id: "737489069872906280",
        string: "<a:leveldown:737489069872906280>"
    },
    "nochange": {
        id: "737489069797408808",
        string: "<a:nochange:737489069797408808>"
    },
    "user": {
        id: "737489070430748673",
        string: "<a:user:737489070430748673>"
    },
    "gold_coins": {
        id: "737489070346993735",
        string: "<a:gold_coins:737489070346993735>"
    },
    "polar_bear": {
        id: "737489070976139395",
        string: "<a:polar_bear:737489070976139395>"
    },
    "shield": {
        id: "737489070451720282",
        string: "<a:shieldd:737489070451720282>"
    },
    "tild": {
        id: "737489071579987979",
        string: "<a:tild:737489071579987979>"
    },
};

Emojis.emojisDev = {

};

Emojis.general = {
    "one": "1âƒ£",
    "two": "2âƒ£",
    "three": "3âƒ£",
    "four": "4âƒ£",
    "five": "5âƒ£",
    "six": "6âƒ£",
    "seven": "7âƒ£",
    "eight": "8âƒ£",
    "nine": "9âƒ£",
    "red_circle": "ðŸ”´",
    "blue_circle": "ðŸ”µ",
    "money_bag": "ðŸ’°",
    "star": "â­",
    "eight_pointed_black_star": "âœ´",
    "backpack": "ðŸŽ’",
    "shield": "ðŸ›¡",
    "id": "ðŸ†”",
    "red_heart": "â¤ï¸",
    "black_heart": "ðŸ–¤",
    "right_arrow": "â–¶",
    "left_arrow": "â—€",
    "critical": "ðŸ’¢",
    "hourglass_not_done": "â³",
    "scroll": "ðŸ“œ",
    "q_mark": "â“",
    "g_vmark": "âœ…",
    "g_xmark": "âŒ",
    "stun": "ðŸŒ€",
    "hammer": "ðŸ”¨",
    "waving_hand": "ðŸ‘‹",
    "briefcase": "ðŸ’¼",
    "baggage_claim": "ðŸ›„",
    "crossed_swords": "âš”ï¸",
    "cloud": "â˜ï¸",
    "tornado": "ðŸŒªï¸",
    "sun": "â˜€ï¸",
    "rain": "ðŸŒ§ï¸",
    "snow": "ðŸŒ¨ï¸",
    "fog": "ðŸŒ«ï¸",
    "fire": "ðŸ”¥",
    "snowflake": "â„ï¸",
    "rainstorm": "â›ˆï¸",
    "thermometer": "ðŸŒ¡ï¸",
    "orange_circle": "ðŸŸ ",
    "purple_circle": "ðŸŸ£",
    "white_circle": "âšª",
    "green_circle": "ðŸŸ¢",
    "gemstone": "ðŸ’Ž",
    "herb": "ðŸŒ¿",
    "pinetree": "ðŸŒ²",
    "axe": "ðŸª“",
    "pickaxe": "â›ï¸",
    "gloves": "ðŸ§¤",
    "king": "ðŸ¤´",
    "man_pilot": "ðŸ‘¨â€âœˆï¸",
    "person": "ðŸ§‘",
    "loudspeaker": "ðŸ“¢",
    "warning": "âš ï¸",
    "sunrise_over_the_mountain": "ðŸŒ„",
    "simple_left_to_right_arrow": "â†’",
    "stopwatch": "â±ï¸",
    "horse_face": "ðŸ´",
    "collision": "ðŸ’¥",
    "national_park": "ðŸžï¸",
    "castle": "ðŸ°",
    "biceps": "ðŸ’ªðŸ»",
    "boot": "ðŸ¥¾",
    "books": "ðŸ“š",
    "eye": "ðŸ‘ï¸",
    "sparkles": "âœ¨",
    "high_voltage": "âš¡",
    "game_die": "ðŸŽ²",
    "light_bulb": "ðŸ’¡",
    "mage": "ðŸ§™",
    "clipboard": "ðŸ“‹",
    "seedling": "ðŸŒ±",
    "balance_scale": "âš–ï¸",
    "trophy": "ðŸ†",
    "camel": "ðŸª",
    "salamander": "ðŸ¦Ž",
    "skull_and_bones": "â˜ ï¸",
    "vmark": "âœ…",
    "xmark": "âŒ"

};

Emojis.stats = {
    "strength": Emojis.general.biceps,
    "constitution": Emojis.general.red_heart,
    "dexterity": Emojis.general.waving_hand,
    "will": Emojis.general.high_voltage,
    "charisma": Emojis.general.sparkles,
    "intellect": Emojis.general.books,
    "armor": Emojis.emojisProd.item_type_chest.string,
    "wisdom": Emojis.general.light_bulb,
    "perception": Emojis.general.eye,
    "luck": Emojis.general.game_die,
};

Emojis.typeItem = {
    "weapon": Emojis.general.crossed_swords,
    "chest": Emojis.getString("item_type_chest"),
    "legs": Emojis.getString("item_type_legs"),
    "head": Emojis.getString("item_type_helmet"),
    "resource": Emojis.getString("item_type_resource"),
    "lootbox": Emojis.getString("item_type_lootbox"),
    "potion": Emojis.getString("potion_empty"),
    "mount": Emojis.getString("saddle"),
};

Emojis.subtypeItem = {
    "ore": Emojis.emojisProd.ore_common.string,
    "wood": Emojis.emojisProd.wood_common.string,
    "plant": Emojis.emojisProd.herb_rare.string,
    "sword": Emojis.emojisProd.sword2.string,
    "whip": Emojis.emojisProd.sword2.string,
    "armor": Emojis.emojisProd.item_type_chest.string,
    "loot_box_equipment": Emojis.emojisProd.item_type_lootbox.string,
    "random_loot_box_equipment": Emojis.emojisProd.item_type_lootbox.string,
    "founder_box": Emojis.emojisProd.item_type_lootbox.string,
    "reset_time_potion": Emojis.emojisProd.reset_time_potion.string,
    "energy_potion": Emojis.emojisProd.reset_time_potion.string,
    "horse": Emojis.general.horse_face,
    "crystal": Emojis.general.gemstone,
    "salamander": Emojis.general.salamander,
    "camel": Emojis.general.camel,
    "polar_bear": Emojis.emojisProd.polar_bear.string,
};

Emojis.areaType = {
    "wild": Emojis.general.national_park,
    "city": Emojis.general.castle,
    "dungeon": Emojis.emojisProd.dungeon_door.string
};

Emojis.areaBonus = {
    "xp_fight": Emojis.emojisProd.exp.string,
    "xp_collect": Emojis.emojisProd.exp.string,
    "gold_drop": Emojis.emojisProd.gold_coins.string,
    "item_drop": Emojis.emojisProd.sword.string,
    "collect_drop": Emojis.general.gloves,
    "xp_craft": Emojis.general.hammer
}

function configureAliases() {
    Emojis.emojisProd.normal = Emojis.emojisProd.monster;
}

configureAliases();

module.exports = Emojis;