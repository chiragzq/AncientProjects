! function () {
    function a(b) {
        if (!(this instanceof a)) return new a(b);
        if ("function" == typeof b) return this.random = b, this;
        var c;
        arguments.length && (this.seed = 0);
        for (var d = 0; d < arguments.length; d++) {
            if (c = 0, "string" == typeof arguments[d]) for (var e = 0; e < arguments[d].length; e++) c += (arguments[d].length - e) * arguments[d].charCodeAt(e);
            else c = arguments[d];
            this.seed += (arguments.length - d) * c
        }
        return this.mt = this.mersenne_twister(this.seed), this.random = function () {
            return this.mt.random(this.seed)
        }, this
    }
    function b(a, b) {
        if (a || (a = {}), b) for (var c in b) "undefined" == typeof a[c] && (a[c] = b[c]);
        return a
    }
    function c(a, b) {
        if (a) throw new RangeError(b)
    }
    function d(a) {
        return function () {
            return this.natural(a)
        }
    }
    function e(a, b) {
        for (var c = r(a), d = 0, e = c.length; e > d; d++) key = c[d], b[key] = a[key] || b[key]
    }
    function f(a, b) {
        for (var c = 0, d = a.length; d > c; c++) b[c] = a[c]
    }
    function g(a, b) {
        var c = Array.isArray(a),
            d = b || (c ? new Array(a.length) : {});
        return c ? f(a, d) : e(a, d), d
    }
    var h = 9007199254740992,
        i = -h,
        j = "0123456789",
        k = "abcdefghijklmnopqrstuvwxyz",
        l = k.toUpperCase(),
        m = j + "abcdef",
        n = Array.prototype.slice;
    a.prototype.VERSION = "0.7.1";
    var o = function () {
        throw new Error("No Base64 encoder available.")
    };
    ! function () {
        "function" == typeof btoa ? o = btoa : "function" == typeof Buffer && (o = function (a) {
            return new Buffer(a).toString("base64")
        })
    }(), a.prototype.bool = function (a) {
        return a = b(a, {
            likelihood: 50
        }), c(a.likelihood < 0 || a.likelihood > 100, "Chance: Likelihood accepts values from 0 to 100."), 100 * this.random() < a.likelihood
    }, a.prototype.character = function (a) {
        a = b(a);
        var d, e, f = "!@#$%^&*()[]";
        return c(a.alpha && a.symbols, "Chance: Cannot specify both alpha and symbols."), d = "lower" === a.casing ? k : "upper" === a.casing ? l : k + l, e = a.pool ? a.pool : a.alpha ? d : a.symbols ? f : d + j + f, e.charAt(this.natural({
            max: e.length - 1
        }))
    }, a.prototype.floating = function (a) {
        var d;
        a = b(a, {
            fixed: 4
        });
        var e = Math.pow(10, a.fixed);
        c(a.fixed && a.precision, "Chance: Cannot specify both fixed and precision.");
        var f = h / e,
            g = -f;
        c(a.min && a.fixed && a.min < g, "Chance: Min specified is out of range with fixed. Min should be, at least, " + g), c(a.max && a.fixed && a.max > f, "Chance: Max specified is out of range with fixed. Max should be, at most, " + f), a = b(a, {
            min: g,
            max: f
        }), d = this.integer({
            min: a.min * e,
            max: a.max * e
        });
        var i = (d / e).toFixed(a.fixed);
        return parseFloat(i)
    }, a.prototype.integer = function (a) {
        return a = b(a, {
            min: i,
            max: h
        }), c(a.min > a.max, "Chance: Min cannot be greater than Max."), Math.floor(this.random() * (a.max - a.min + 1) + a.min)
    }, a.prototype.natural = function (a) {
        return a = b(a, {
            min: 0,
            max: h
        }), this.integer(a)
    }, a.prototype.string = function (a) {
        a = b(a);
        var c = a.length || this.natural({
            min: 5,
            max: 20
        }),
            d = a.pool,
            e = this.n(this.character, c, {
                pool: d
            });
        return e.join("")
    }, a.prototype.capitalize = function (a) {
        return a.charAt(0).toUpperCase() + a.substr(1)
    }, a.prototype.mixin = function (b) {
        for (var c in b) a.prototype[c] = b[c];
        return this
    }, a.prototype.unique = function (a, c, d) {
        d = b(d, {
            comparator: function (a, b) {
                return -1 !== a.indexOf(b)
            }
        });
        for (var e, f = [], g = 0, h = 50 * c, i = n.call(arguments, 2); f.length < c;) if (e = a.apply(this, i), d.comparator(f, e) || (f.push(e), g = 0), ++g > h) throw new RangeError("Chance: num is likely too large for sample set");
        return f
    }, a.prototype.n = function (a, b) {
        var c = b || 1,
            d = [],
            e = n.call(arguments, 2);
        for (c = Math.max(0, c), null; c--; null) d.push(a.apply(this, e));
        return d
    }, a.prototype.pad = function (a, b, c) {
        return c = c || "0", a += "", a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
    }, a.prototype.pick = function (a, b) {
        if (0 === a.length) throw new RangeError("Chance: Cannot pick() from an empty array");
        return b && 1 !== b ? this.shuffle(a).slice(0, b) : a[this.natural({
            max: a.length - 1
        })]
    }, a.prototype.shuffle = function (a) {
        for (var b = a.slice(0), c = [], d = 0, e = Number(b.length), f = 0; e > f; f++) d = this.natural({
            max: b.length - 1
        }), c[f] = b[d], b.splice(d, 1);
        return c
    }, a.prototype.weighted = function (a, b) {
        if (a.length !== b.length) throw new RangeError("Chance: length of array and weights must match");
        if (b.some(function (a) {
            return 1 > a
        })) {
            var c = b.reduce(function (a, b) {
                return a > b ? b : a
            }, b[0]),
                d = 1 / c;
            b = b.map(function (a) {
                return a * d
            })
        }
        var e, f = b.reduce(function (a, b) {
            return a + b
        }, 0),
            g = this.natural({
                min: 1,
                max: f
            }),
            h = 0;
        return b.some(function (b, c) {
            return h + b >= g ? (e = a[c], !0) : (h += b, !1)
        }), e
    }, a.prototype.paragraph = function (a) {
        a = b(a);
        var c = a.sentences || this.natural({
            min: 3,
            max: 7
        }),
            d = this.n(this.sentence, c);
        return d.join(" ")
    }, a.prototype.sentence = function (a) {
        a = b(a);
        var c, d = a.words || this.natural({
            min: 12,
            max: 18
        }),
            e = this.n(this.word, d);
        return c = e.join(" "), c = this.capitalize(c) + "."
    }, a.prototype.syllable = function (a) {
        a = b(a);
        for (var c, d = a.length || this.natural({
            min: 2,
            max: 3
        }), e = "bcdfghjklmnprstvwz", f = "aeiou", g = e + f, h = "", i = 0; d > i; i++) c = this.character(0 === i ? {
            pool: g
        } : -1 === e.indexOf(c) ? {
            pool: e
        } : {
            pool: f
        }), h += c;
        return h
    }, a.prototype.word = function (a) {
        a = b(a), c(a.syllables && a.length, "Chance: Cannot specify both syllables AND length.");
        var d = a.syllables || this.natural({
            min: 1,
            max: 3
        }),
            e = "";
        if (a.length) {
            do e += this.syllable();
            while (e.length < a.length);
            e = e.substring(0, a.length)
        } else for (var f = 0; d > f; f++) e += this.syllable();
        return e
    }, a.prototype.age = function (a) {
        a = b(a);
        var c;
        switch (a.type) {
            case "child":
                c = {
                    min: 1,
                    max: 12
                };
                break;
            case "teen":
                c = {
                    min: 13,
                    max: 19
                };
                break;
            case "adult":
                c = {
                    min: 18,
                    max: 65
                };
                break;
            case "senior":
                c = {
                    min: 65,
                    max: 100
                };
                break;
            case "all":
                c = {
                    min: 1,
                    max: 100
                };
                break;
            default:
                c = {
                    min: 18,
                    max: 65
                }
        }
        return this.natural(c)
    }, a.prototype.birthday = function (a) {
        return a = b(a, {
            year: (new Date).getFullYear() - this.age(a)
        }), this.date(a)
    }, a.prototype.cpf = function () {
        var a = this.n(this.natural, 9, {
            max: 9
        }),
            b = 2 * a[8] + 3 * a[7] + 4 * a[6] + 5 * a[5] + 6 * a[4] + 7 * a[3] + 8 * a[2] + 9 * a[1] + 10 * a[0];
        b = 11 - b % 11, b >= 10 && (b = 0);
        var c = 2 * b + 3 * a[8] + 4 * a[7] + 5 * a[6] + 6 * a[5] + 7 * a[4] + 8 * a[3] + 9 * a[2] + 10 * a[1] + 11 * a[0];
        return c = 11 - c % 11, c >= 10 && (c = 0), "" + a[0] + a[1] + a[2] + "." + a[3] + a[4] + a[5] + "." + a[6] + a[7] + a[8] + "-" + b + c
    }, a.prototype.first = function (a) {
        return a = b(a, {
            gender: this.gender()
        }), this.pick(this.get("firstNames")[a.gender.toLowerCase()])
    }, a.prototype.gender = function () {
        return this.pick(["Male", "Female"])
    }, a.prototype.last = function () {
        return this.pick(this.get("lastNames"))
    }, a.prototype.name = function (a) {
        a = b(a);
        var c, d = this.first(a),
            e = this.last();
        return c = a.middle ? d + " " + this.first(a) + " " + e : a.middle_initial ? d + " " + this.character({
            alpha: !0,
            casing: "upper"
        }) + ". " + e : d + " " + e, a.prefix && (c = this.prefix(a) + " " + c), a.suffix && (c = c + " " + this.suffix(a)), c
    }, a.prototype.name_prefixes = function (a) {
        a = a || "all", a = a.toLowerCase();
        var b = [{
            name: "Doctor",
            abbreviation: "Dr."
        }];
        return ("male" === a || "all" === a) && b.push({
            name: "Mister",
            abbreviation: "Mr."
        }), ("female" === a || "all" === a) && (b.push({
            name: "Miss",
            abbreviation: "Miss"
        }), b.push({
            name: "Misses",
            abbreviation: "Mrs."
        })), b
    }, a.prototype.prefix = function (a) {
        return this.name_prefix(a)
    }, a.prototype.name_prefix = function (a) {
        return a = b(a, {
            gender: "all"
        }), a.full ? this.pick(this.name_prefixes(a.gender)).name : this.pick(this.name_prefixes(a.gender)).abbreviation
    }, a.prototype.ssn = function (a) {
        a = b(a, {
            ssnFour: !1,
            dashes: !0
        });
        var c, d = "1234567890",
            e = a.dashes ? "-" : "";
        return c = a.ssnFour ? this.string({
            pool: d,
            length: 4
        }) : this.string({
            pool: d,
            length: 3
        }) + e + this.string({
            pool: d,
            length: 2
        }) + e + this.string({
            pool: d,
            length: 4
        })
    }, a.prototype.name_suffixes = function () {
        var a = [{
            name: "Doctor of Osteopathic Medicine",
            abbreviation: "D.O."
        }, {
            name: "Doctor of Philosophy",
            abbreviation: "Ph.D."
        }, {
            name: "Esquire",
            abbreviation: "Esq."
        }, {
            name: "Junior",
            abbreviation: "Jr."
        }, {
            name: "Juris Doctor",
            abbreviation: "J.D."
        }, {
            name: "Master of Arts",
            abbreviation: "M.A."
        }, {
            name: "Master of Business Administration",
            abbreviation: "M.B.A."
        }, {
            name: "Master of Science",
            abbreviation: "M.S."
        }, {
            name: "Medical Doctor",
            abbreviation: "M.D."
        }, {
            name: "Senior",
            abbreviation: "Sr."
        }, {
            name: "The Third",
            abbreviation: "III"
        }, {
            name: "The Fourth",
            abbreviation: "IV"
        }];
        return a
    }, a.prototype.suffix = function (a) {
        return this.name_suffix(a)
    }, a.prototype.name_suffix = function (a) {
        return a = b(a), a.full ? this.pick(this.name_suffixes()).name : this.pick(this.name_suffixes()).abbreviation
    }, a.prototype.android_id = function () {
        return "APA91" + this.string({
            pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
            length: 178
        })
    }, a.prototype.apple_token = function () {
        return this.string({
            pool: "abcdef1234567890",
            length: 64
        })
    }, a.prototype.wp8_anid2 = function () {
        return o(this.hash({
            length: 32
        }))
    }, a.prototype.wp7_anid = function () {
        return "A=" + this.guid().replace(/-/g, "").toUpperCase() + "&E=" + this.hash({
            length: 3
        }) + "&W=" + this.integer({
            min: 0,
            max: 9
        })
    }, a.prototype.bb_pin = function () {
        return this.hash({
            length: 8
        })
    }, a.prototype.color = function (a) {
        function c(a, b) {
            return [a, a, a].join(b || "")
        }
        a = b(a, {
            format: this.pick(["hex", "shorthex", "rgb", "0x"]),
            grayscale: !1,
            casing: "lower"
        });
        var d, e = a.grayscale;
        if ("hex" === a.format) d = "#" + (e ? c(this.hash({
            length: 2
        })) : this.hash({
            length: 6
        }));
        else if ("shorthex" === a.format) d = "#" + (e ? c(this.hash({
            length: 1
        })) : this.hash({
            length: 3
        }));
        else if ("rgb" === a.format) d = e ? "rgb(" + c(this.natural({
            max: 255
        }), ",") + ")" : "rgb(" + this.natural({
            max: 255
        }) + "," + this.natural({
            max: 255
        }) + "," + this.natural({
            max: 255
        }) + ")";
        else {
            if ("0x" !== a.format) throw new Error('Invalid format provided. Please provide one of "hex", "shorthex", "rgb" or "0x".');
            d = "0x" + (e ? c(this.hash({
                length: 2
            })) : this.hash({
                length: 6
            }))
        }
        return "upper" === a.casing && (d = d.toUpperCase()), d
    }, a.prototype.domain = function (a) {
        return a = b(a), this.word() + "." + (a.tld || this.tld())
    }, a.prototype.email = function (a) {
        return a = b(a), this.word({
            length: a.length
        }) + "@" + (a.domain || this.domain())
    }, a.prototype.fbid = function () {
        return parseInt("10000" + this.natural({
            max: 1e11
        }), 10)
    }, a.prototype.google_analytics = function () {
        var a = this.pad(this.natural({
            max: 999999
        }), 6),
            b = this.pad(this.natural({
                max: 99
            }), 2);
        return "UA-" + a + "-" + b
    }, a.prototype.hashtag = function () {
        return "#" + this.word()
    }, a.prototype.ip = function () {
        return this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        })
    }, a.prototype.ipv6 = function () {
        var a = this.n(this.hash, 8, {
            length: 4
        });
        return a.join(":")
    }, a.prototype.klout = function () {
        return this.natural({
            min: 1,
            max: 99
        })
    }, a.prototype.tlds = function () {
        return ["com", "org", "edu", "gov", "co.uk", "net", "io"]
    }, a.prototype.tld = function () {
        return this.pick(this.tlds())
    }, a.prototype.twitter = function () {
        return "@" + this.word()
    }, a.prototype.url = function (a) {
        a = b(a, {
            protocol: "http",
            domain: this.domain(a),
            domain_prefix: "",
            path: this.word(),
            extensions: []
        });
        var c = a.extensions.length > 0 ? "." + this.pick(a.extensions) : "",
            d = a.domain_prefix ? a.domain_prefix + "." + a.domain : a.domain;
        return a.protocol + "://" + d + "/" + a.path + c
    }, a.prototype.address = function (a) {
        return a = b(a), this.natural({
            min: 5,
            max: 2e3
        }) + " " + this.street(a)
    }, a.prototype.altitude = function (a) {
        return a = b(a, {
            fixed: 5,
            max: 8848
        }), this.floating({
            min: 0,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.areacode = function (a) {
        a = b(a, {
            parens: !0
        });
        var c = this.natural({
            min: 2,
            max: 9
        }).toString() + this.natural({
            min: 0,
            max: 8
        }).toString() + this.natural({
            min: 0,
            max: 9
        }).toString();
        return a.parens ? "(" + c + ")" : c
    }, a.prototype.city = function () {
        return this.capitalize(this.word({
            syllables: 3
        }))
    }, a.prototype.coordinates = function (a) {
        return a = b(a), this.latitude(a) + ", " + this.longitude(a)
    }, a.prototype.countries = function () {
        return this.get("countries")
    }, a.prototype.country = function (a) {
        a = b(a);
        var c = this.pick(this.countries());
        return a.full ? c.name : c.abbreviation
    }, a.prototype.depth = function (a) {
        return a = b(a, {
            fixed: 5,
            min: -2550
        }), this.floating({
            min: a.min,
            max: 0,
            fixed: a.fixed
        })
    }, a.prototype.geohash = function (a) {
        return a = b(a, {
            length: 7
        }), this.string({
            length: a.length,
            pool: "0123456789bcdefghjkmnpqrstuvwxyz"
        })
    }, a.prototype.geojson = function (a) {
        return a = b(a), this.latitude(a) + ", " + this.longitude(a) + ", " + this.altitude(a)
    }, a.prototype.latitude = function (a) {
        return a = b(a, {
            fixed: 5,
            min: -90,
            max: 90
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.longitude = function (a) {
        return a = b(a, {
            fixed: 5,
            min: -180,
            max: 180
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.phone = function (a) {
        var c, d = this,
            e = function (a) {
                var b = [];
                return a.sections.forEach(function (a) {
                    b.push(d.string({
                        pool: "0123456789",
                        length: a
                    }))
                }), a.area + b.join(" ")
            };
        a = b(a, {
            formatted: !0,
            country: "us",
            mobile: !1
        }), a.formatted || (a.parens = !1);
        var f;
        switch (a.country) {
            case "fr":
                a.mobile ? (c = this.pick(["06", "07"]) + d.string({
                    pool: "0123456789",
                    length: 8
                }), f = a.formatted ? c.match(/../g).join(" ") : c) : (c = this.pick(["01" + this.pick(["30", "34", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "53", "55", "56", "58", "60", "64", "69", "70", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83"]) + d.string({
                    pool: "0123456789",
                    length: 6
                }), "02" + this.pick(["14", "18", "22", "23", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40", "41", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "56", "57", "61", "62", "69", "72", "76", "77", "78", "85", "90", "96", "97", "98", "99"]) + d.string({
                    pool: "0123456789",
                    length: 6
                }), "03" + this.pick(["10", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "39", "44", "45", "51", "52", "54", "55", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90"]) + d.string({
                    pool: "0123456789",
                    length: 6
                }), "04" + this.pick(["11", "13", "15", "20", "22", "26", "27", "30", "32", "34", "37", "42", "43", "44", "50", "56", "57", "63", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "88", "89", "90", "91", "92", "93", "94", "95", "97", "98"]) + d.string({
                    pool: "0123456789",
                    length: 6
                }), "05" + this.pick(["08", "16", "17", "19", "24", "31", "32", "33", "34", "35", "40", "45", "46", "47", "49", "53", "55", "56", "57", "58", "59", "61", "62", "63", "64", "65", "67", "79", "81", "82", "86", "87", "90", "94"]) + d.string({
                    pool: "0123456789",
                    length: 6
                }), "09" + d.string({
                    pool: "0123456789",
                    length: 8
                })]), f = a.formatted ? c.match(/../g).join(" ") : c);
                break;
            case "uk":
                a.mobile ? (c = this.pick([{
                    area: "07" + this.pick(["4", "5", "7", "8", "9"]),
                    sections: [2, 6]
                }, {
                    area: "07624 ",
                    sections: [6]
                }]), f = a.formatted ? e(c) : e(c).replace(" ", "")) : (c = this.pick([{
                    area: "01" + this.character({
                        pool: "234569"
                    }) + "1 ",
                    sections: [3, 4]
                }, {
                    area: "020 " + this.character({
                        pool: "378"
                    }),
                    sections: [3, 4]
                }, {
                    area: "023 " + this.character({
                        pool: "89"
                    }),
                    sections: [3, 4]
                }, {
                    area: "024 7",
                    sections: [3, 4]
                }, {
                    area: "028 " + this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]),
                    sections: [2, 4]
                }, {
                    area: "012" + this.pick(["04", "08", "54", "76", "97", "98"]) + " ",
                    sections: [5]
                }, {
                    area: "013" + this.pick(["63", "64", "84", "86"]) + " ",
                    sections: [5]
                }, {
                    area: "014" + this.pick(["04", "20", "60", "61", "80", "88"]) + " ",
                    sections: [5]
                }, {
                    area: "015" + this.pick(["24", "27", "62", "66"]) + " ",
                    sections: [5]
                }, {
                    area: "016" + this.pick(["06", "29", "35", "47", "59", "95"]) + " ",
                    sections: [5]
                }, {
                    area: "017" + this.pick(["26", "44", "50", "68"]) + " ",
                    sections: [5]
                }, {
                    area: "018" + this.pick(["27", "37", "84", "97"]) + " ",
                    sections: [5]
                }, {
                    area: "019" + this.pick(["00", "05", "35", "46", "49", "63", "95"]) + " ",
                    sections: [5]
                }]), f = a.formatted ? e(c) : e(c).replace(" ", "", "g"));
                break;
            case "us":
                var g = this.areacode(a).toString(),
                    h = this.natural({
                        min: 2,
                        max: 9
                    }).toString() + this.natural({
                        min: 0,
                        max: 9
                    }).toString() + this.natural({
                        min: 0,
                        max: 9
                    }).toString(),
                    i = this.natural({
                        min: 1e3,
                        max: 9999
                    }).toString();
                f = a.formatted ? g + " " + h + "-" + i : g + h + i
        }
        return f
    }, a.prototype.postal = function () {
        var a = this.character({
            pool: "XVTSRPNKLMHJGECBA"
        }),
            b = a + this.natural({
                max: 9
            }) + this.character({
                alpha: !0,
                casing: "upper"
            }),
            c = this.natural({
                max: 9
            }) + this.character({
                alpha: !0,
                casing: "upper"
            }) + this.natural({
                max: 9
            });
        return b + " " + c
    }, a.prototype.provinces = function () {
        return this.get("provinces")
    }, a.prototype.province = function (a) {
        return a && a.full ? this.pick(this.provinces()).name : this.pick(this.provinces()).abbreviation
    }, a.prototype.state = function (a) {
        return a && a.full ? this.pick(this.states(a)).name : this.pick(this.states(a)).abbreviation
    }, a.prototype.states = function (a) {
        a = b(a);
        var c, d = this.get("us_states_and_dc"),
            e = this.get("territories"),
            f = this.get("armed_forces");
        return c = d, a.territories && (c = c.concat(e)), a.armed_forces && (c = c.concat(f)), c
    }, a.prototype.street = function (a) {
        a = b(a);
        var c = this.word({
            syllables: 2
        });
        return c = this.capitalize(c), c += " ", c += a.short_suffix ? this.street_suffix().abbreviation : this.street_suffix().name
    }, a.prototype.street_suffix = function () {
        return this.pick(this.street_suffixes())
    }, a.prototype.street_suffixes = function () {
        return this.get("street_suffixes")
    }, a.prototype.zip = function (a) {
        var b = this.n(this.natural, 5, {
            max: 9
        });
        return a && a.plusfour === !0 && (b.push("-"), b = b.concat(this.n(this.natural, 4, {
            max: 9
        }))), b.join("")
    }, a.prototype.ampm = function () {
        return this.bool() ? "am" : "pm"
    }, a.prototype.date = function (a) {
        var c, d;
        if (a && (a.min || a.max)) {
            a = b(a, {
                american: !0,
                string: !1
            });
            var e = "undefined" != typeof a.min ? a.min.getTime() : 1,
                f = "undefined" != typeof a.max ? a.max.getTime() : 864e13;
            d = new Date(this.natural({
                min: e,
                max: f
            }))
        } else {
            var g = this.month({
                raw: !0
            });
            a = b(a, {
                year: parseInt(this.year(), 10),
                month: g.numeric - 1,
                day: this.natural({
                    min: 1,
                    max: g.days
                }),
                hour: this.hour(),
                minute: this.minute(),
                second: this.second(),
                millisecond: this.millisecond(),
                american: !0,
                string: !1
            }), d = new Date(a.year, a.month, a.day, a.hour, a.minute, a.second, a.millisecond)
        }
        return c = a.american ? d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() : d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(), a.string ? c : d
    }, a.prototype.hammertime = function (a) {
        return this.date(a).getTime()
    }, a.prototype.hour = function (a) {
        return a = b(a, {
            min: 1,
            max: a && a.twentyfour ? 24 : 12
        }), c(a.min < 1, "Chance: Min cannot be less than 1."), c(a.twentyfour && a.max > 24, "Chance: Max cannot be greater than 24 for twentyfour option."), c(!a.twentyfour && a.max > 12, "Chance: Max cannot be greater than 12."), c(a.min > a.max, "Chance: Min cannot be greater than Max."), this.natural({
            min: a.min,
            max: a.max
        })
    }, a.prototype.millisecond = function () {
        return this.natural({
            max: 999
        })
    }, a.prototype.minute = a.prototype.second = function (a) {
        return a = b(a, {
            min: 0,
            max: 59
        }), c(a.min < 0, "Chance: Min cannot be less than 0."), c(a.max > 59, "Chance: Max cannot be greater than 59."), c(a.min > a.max, "Chance: Min cannot be greater than Max."), this.natural({
            min: a.min,
            max: a.max
        })
    }, a.prototype.month = function (a) {
        a = b(a, {
            min: 1,
            max: 12
        }), c(a.min < 1, "Chance: Min cannot be less than 1."), c(a.max > 12, "Chance: Max cannot be greater than 12."), c(a.min > a.max, "Chance: Min cannot be greater than Max.");
        var d = this.pick(this.months().slice(a.min - 1, a.max));
        return a.raw ? d : d.name
    }, a.prototype.months = function () {
        return this.get("months")
    }, a.prototype.second = function () {
        return this.natural({
            max: 59
        })
    }, a.prototype.timestamp = function () {
        return this.natural({
            min: 1,
            max: parseInt((new Date).getTime() / 1e3, 10)
        })
    }, a.prototype.year = function (a) {
        return a = b(a, {
            min: (new Date).getFullYear()
        }), a.max = "undefined" != typeof a.max ? a.max : a.min + 100, this.natural(a).toString()
    }, a.prototype.cc = function (a) {
        a = b(a);
        var c, d, e;
        return c = this.cc_type(a.type ? {
            name: a.type,
            raw: !0
        } : {
            raw: !0
        }), d = c.prefix.split(""), e = c.length - c.prefix.length - 1, d = d.concat(this.n(this.integer, e, {
            min: 0,
            max: 9
        })), d.push(this.luhn_calculate(d.join(""))), d.join("")
    }, a.prototype.cc_types = function () {
        return this.get("cc_types")
    }, a.prototype.cc_type = function (a) {
        a = b(a);
        var c = this.cc_types(),
            d = null;
        if (a.name) {
            for (var e = 0; e < c.length; e++) if (c[e].name === a.name || c[e].short_name === a.name) {
                d = c[e];
                break
            }
            if (null === d) throw new Error("Credit card type '" + a.name + "'' is not supported")
        } else d = this.pick(c);
        return a.raw ? d : d.name
    }, a.prototype.currency_types = function () {
        return this.get("currency_types")
    }, a.prototype.currency = function () {
        return this.pick(this.currency_types())
    }, a.prototype.currency_pair = function (a) {
        var b = this.unique(this.currency, 2, {
            comparator: function (a, b) {
                return a.reduce(function (a, c) {
                    return a || c.code === b.code
                }, !1)
            }
        });
        return a ? b[0] + "/" + b[1] : b
    }, a.prototype.dollar = function (a) {
        a = b(a, {
            max: 1e4,
            min: 0
        });
        var c = this.floating({
            min: a.min,
            max: a.max,
            fixed: 2
        }).toString(),
            d = c.split(".")[1];
        return void 0 === d ? c += ".00" : d.length < 2 && (c += "0"), 0 > c ? "-$" + c.replace("-", "") : "$" + c
    }, a.prototype.exp = function (a) {
        a = b(a);
        var c = {};
        return c.year = this.exp_year(), c.month = c.year === (new Date).getFullYear() ? this.exp_month({
            future: !0
        }) : this.exp_month(), a.raw ? c : c.month + "/" + c.year
    }, a.prototype.exp_month = function (a) {
        a = b(a);
        var c, d, e = (new Date).getMonth();
        if (a.future) {
            do c = this.month({
                raw: !0
            }).numeric, d = parseInt(c, 10);
            while (e > d)
        } else c = this.month({
            raw: !0
        }).numeric;
        return c
    }, a.prototype.exp_year = function () {
        return this.year({
            max: (new Date).getFullYear() + 10
        })
    }, a.prototype.d4 = d({
        min: 1,
        max: 4
    }), a.prototype.d6 = d({
        min: 1,
        max: 6
    }), a.prototype.d8 = d({
        min: 1,
        max: 8
    }), a.prototype.d10 = d({
        min: 1,
        max: 10
    }), a.prototype.d12 = d({
        min: 1,
        max: 12
    }), a.prototype.d20 = d({
        min: 1,
        max: 20
    }), a.prototype.d30 = d({
        min: 1,
        max: 30
    }), a.prototype.d100 = d({
        min: 1,
        max: 100
    }), a.prototype.rpg = function (a, c) {
        if (c = b(c), null === a) throw new Error("A type of die roll must be included");
        var d = a.toLowerCase().split("d"),
            e = [];
        if (2 !== d.length || !parseInt(d[0], 10) || !parseInt(d[1], 10)) throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
        for (var f = d[0]; f > 0; f--) e[f - 1] = this.natural({
            min: 1,
            max: d[1]
        });
        return "undefined" != typeof c.sum && c.sum ? e.reduce(function (a, b) {
            return a + b
        }) : e
    }, a.prototype.guid = function (a) {
        a = b(a, {
            version: 5
        });
        var c = "abcdef1234567890",
            d = "ab89",
            e = this.string({
                pool: c,
                length: 8
            }) + "-" + this.string({
                pool: c,
                length: 4
            }) + "-" + a.version + this.string({
                pool: c,
                length: 3
            }) + "-" + this.string({
                pool: d,
                length: 1
            }) + this.string({
                pool: c,
                length: 3
            }) + "-" + this.string({
                pool: c,
                length: 12
            });
        return e
    }, a.prototype.hash = function (a) {
        a = b(a, {
            length: 40,
            casing: "lower"
        });
        var c = "upper" === a.casing ? m.toUpperCase() : m;
        return this.string({
            pool: c,
            length: a.length
        })
    }, a.prototype.luhn_check = function (a) {
        var b = a.toString(),
            c = +b.substring(b.length - 1);
        return c === this.luhn_calculate(+b.substring(0, b.length - 1))
    }, a.prototype.luhn_calculate = function (a) {
        for (var b, c = a.toString().split("").reverse(), d = 0, e = 0, f = c.length; f > e; ++e) b = +c[e], e % 2 === 0 && (b *= 2, b > 9 && (b -= 9)), d += b;
        return 9 * d % 10
    };
    var p = {
        firstNames: {
            male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
            female: ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "John", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"]
        },
        lastNames: ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "Obrien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman", "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", "Thornton", "Dennis", "McGee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "McCarthy", "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", "McBride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", "McLaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", "Pittman", "Brady", "McCormick", "Holloway", "Brock", "Poole", "Frank", "Logan", "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", "Underwood", "Hogan", "McKenzie", "Collier", "Luna", "Phelps", "McGuire", "Allison", "Bridges", "Wilkerson", "Nash", "Summers", "Atkins"],
        countries: [{
            name: "Afghanistan",
            abbreviation: "AF"
        }, {
            name: "Albania",
            abbreviation: "AL"
        }, {
            name: "Algeria",
            abbreviation: "DZ"
        }, {
            name: "American Samoa",
            abbreviation: "AS"
        }, {
            name: "Andorra",
            abbreviation: "AD"
        }, {
            name: "Angola",
            abbreviation: "AO"
        }, {
            name: "Anguilla",
            abbreviation: "AI"
        }, {
            name: "Antarctica",
            abbreviation: "AQ"
        }, {
            name: "Antigua and Barbuda",
            abbreviation: "AG"
        }, {
            name: "Argentina",
            abbreviation: "AR"
        }, {
            name: "Armenia",
            abbreviation: "AM"
        }, {
            name: "Aruba",
            abbreviation: "AW"
        }, {
            name: "Australia",
            abbreviation: "AU"
        }, {
            name: "Austria",
            abbreviation: "AT"
        }, {
            name: "Azerbaijan",
            abbreviation: "AZ"
        }, {
            name: "Bahamas",
            abbreviation: "BS"
        }, {
            name: "Bahrain",
            abbreviation: "BH"
        }, {
            name: "Bangladesh",
            abbreviation: "BD"
        }, {
            name: "Barbados",
            abbreviation: "BB"
        }, {
            name: "Belarus",
            abbreviation: "BY"
        }, {
            name: "Belgium",
            abbreviation: "BE"
        }, {
            name: "Belize",
            abbreviation: "BZ"
        }, {
            name: "Benin",
            abbreviation: "BJ"
        }, {
            name: "Bermuda",
            abbreviation: "BM"
        }, {
            name: "Bhutan",
            abbreviation: "BT"
        }, {
            name: "Bolivia",
            abbreviation: "BO"
        }, {
            name: "Bosnia and Herzegovina",
            abbreviation: "BA"
        }, {
            name: "Botswana",
            abbreviation: "BW"
        }, {
            name: "Bouvet Island",
            abbreviation: "BV"
        }, {
            name: "Brazil",
            abbreviation: "BR"
        }, {
            name: "British Antarctic Territory",
            abbreviation: "BQ"
        }, {
            name: "British Indian Ocean Territory",
            abbreviation: "IO"
        }, {
            name: "British Virgin Islands",
            abbreviation: "VG"
        }, {
            name: "Brunei",
            abbreviation: "BN"
        }, {
            name: "Bulgaria",
            abbreviation: "BG"
        }, {
            name: "Burkina Faso",
            abbreviation: "BF"
        }, {
            name: "Burundi",
            abbreviation: "BI"
        }, {
            name: "Cambodia",
            abbreviation: "KH"
        }, {
            name: "Cameroon",
            abbreviation: "CM"
        }, {
            name: "Canada",
            abbreviation: "CA"
        }, {
            name: "Canton and Enderbury Islands",
            abbreviation: "CT"
        }, {
            name: "Cape Verde",
            abbreviation: "CV"
        }, {
            name: "Cayman Islands",
            abbreviation: "KY"
        }, {
            name: "Central African Republic",
            abbreviation: "CF"
        }, {
            name: "Chad",
            abbreviation: "TD"
        }, {
            name: "Chile",
            abbreviation: "CL"
        }, {
            name: "China",
            abbreviation: "CN"
        }, {
            name: "Christmas Island",
            abbreviation: "CX"
        }, {
            name: "Cocos [Keeling] Islands",
            abbreviation: "CC"
        }, {
            name: "Colombia",
            abbreviation: "CO"
        }, {
            name: "Comoros",
            abbreviation: "KM"
        }, {
            name: "Congo - Brazzaville",
            abbreviation: "CG"
        }, {
            name: "Congo - Kinshasa",
            abbreviation: "CD"
        }, {
            name: "Cook Islands",
            abbreviation: "CK"
        }, {
            name: "Costa Rica",
            abbreviation: "CR"
        }, {
            name: "Croatia",
            abbreviation: "HR"
        }, {
            name: "Cuba",
            abbreviation: "CU"
        }, {
            name: "Cyprus",
            abbreviation: "CY"
        }, {
            name: "Czech Republic",
            abbreviation: "CZ"
        }, {
            name: "Côte d’Ivoire",
            abbreviation: "CI"
        }, {
            name: "Denmark",
            abbreviation: "DK"
        }, {
            name: "Djibouti",
            abbreviation: "DJ"
        }, {
            name: "Dominica",
            abbreviation: "DM"
        }, {
            name: "Dominican Republic",
            abbreviation: "DO"
        }, {
            name: "Dronning Maud Land",
            abbreviation: "NQ"
        }, {
            name: "East Germany",
            abbreviation: "DD"
        }, {
            name: "Ecuador",
            abbreviation: "EC"
        }, {
            name: "Egypt",
            abbreviation: "EG"
        }, {
            name: "El Salvador",
            abbreviation: "SV"
        }, {
            name: "Equatorial Guinea",
            abbreviation: "GQ"
        }, {
            name: "Eritrea",
            abbreviation: "ER"
        }, {
            name: "Estonia",
            abbreviation: "EE"
        }, {
            name: "Ethiopia",
            abbreviation: "ET"
        }, {
            name: "Falkland Islands",
            abbreviation: "FK"
        }, {
            name: "Faroe Islands",
            abbreviation: "FO"
        }, {
            name: "Fiji",
            abbreviation: "FJ"
        }, {
            name: "Finland",
            abbreviation: "FI"
        }, {
            name: "France",
            abbreviation: "FR"
        }, {
            name: "French Guiana",
            abbreviation: "GF"
        }, {
            name: "French Polynesia",
            abbreviation: "PF"
        }, {
            name: "French Southern Territories",
            abbreviation: "TF"
        }, {
            name: "French Southern and Antarctic Territories",
            abbreviation: "FQ"
        }, {
            name: "Gabon",
            abbreviation: "GA"
        }, {
            name: "Gambia",
            abbreviation: "GM"
        }, {
            name: "Georgia",
            abbreviation: "GE"
        }, {
            name: "Germany",
            abbreviation: "DE"
        }, {
            name: "Ghana",
            abbreviation: "GH"
        }, {
            name: "Gibraltar",
            abbreviation: "GI"
        }, {
            name: "Greece",
            abbreviation: "GR"
        }, {
            name: "Greenland",
            abbreviation: "GL"
        }, {
            name: "Grenada",
            abbreviation: "GD"
        }, {
            name: "Guadeloupe",
            abbreviation: "GP"
        }, {
            name: "Guam",
            abbreviation: "GU"
        }, {
            name: "Guatemala",
            abbreviation: "GT"
        }, {
            name: "Guernsey",
            abbreviation: "GG"
        }, {
            name: "Guinea",
            abbreviation: "GN"
        }, {
            name: "Guinea-Bissau",
            abbreviation: "GW"
        }, {
            name: "Guyana",
            abbreviation: "GY"
        }, {
            name: "Haiti",
            abbreviation: "HT"
        }, {
            name: "Heard Island and McDonald Islands",
            abbreviation: "HM"
        }, {
            name: "Honduras",
            abbreviation: "HN"
        }, {
            name: "Hong Kong SAR China",
            abbreviation: "HK"
        }, {
            name: "Hungary",
            abbreviation: "HU"
        }, {
            name: "Iceland",
            abbreviation: "IS"
        }, {
            name: "India",
            abbreviation: "IN"
        }, {
            name: "Indonesia",
            abbreviation: "ID"
        }, {
            name: "Iran",
            abbreviation: "IR"
        }, {
            name: "Iraq",
            abbreviation: "IQ"
        }, {
            name: "Ireland",
            abbreviation: "IE"
        }, {
            name: "Isle of Man",
            abbreviation: "IM"
        }, {
            name: "Israel",
            abbreviation: "IL"
        }, {
            name: "Italy",
            abbreviation: "IT"
        }, {
            name: "Jamaica",
            abbreviation: "JM"
        }, {
            name: "Japan",
            abbreviation: "JP"
        }, {
            name: "Jersey",
            abbreviation: "JE"
        }, {
            name: "Johnston Island",
            abbreviation: "JT"
        }, {
            name: "Jordan",
            abbreviation: "JO"
        }, {
            name: "Kazakhstan",
            abbreviation: "KZ"
        }, {
            name: "Kenya",
            abbreviation: "KE"
        }, {
            name: "Kiribati",
            abbreviation: "KI"
        }, {
            name: "Kuwait",
            abbreviation: "KW"
        }, {
            name: "Kyrgyzstan",
            abbreviation: "KG"
        }, {
            name: "Laos",
            abbreviation: "LA"
        }, {
            name: "Latvia",
            abbreviation: "LV"
        }, {
            name: "Lebanon",
            abbreviation: "LB"
        }, {
            name: "Lesotho",
            abbreviation: "LS"
        }, {
            name: "Liberia",
            abbreviation: "LR"
        }, {
            name: "Libya",
            abbreviation: "LY"
        }, {
            name: "Liechtenstein",
            abbreviation: "LI"
        }, {
            name: "Lithuania",
            abbreviation: "LT"
        }, {
            name: "Luxembourg",
            abbreviation: "LU"
        }, {
            name: "Macau SAR China",
            abbreviation: "MO"
        }, {
            name: "Macedonia",
            abbreviation: "MK"
        }, {
            name: "Madagascar",
            abbreviation: "MG"
        }, {
            name: "Malawi",
            abbreviation: "MW"
        }, {
            name: "Malaysia",
            abbreviation: "MY"
        }, {
            name: "Maldives",
            abbreviation: "MV"
        }, {
            name: "Mali",
            abbreviation: "ML"
        }, {
            name: "Malta",
            abbreviation: "MT"
        }, {
            name: "Marshall Islands",
            abbreviation: "MH"
        }, {
            name: "Martinique",
            abbreviation: "MQ"
        }, {
            name: "Mauritania",
            abbreviation: "MR"
        }, {
            name: "Mauritius",
            abbreviation: "MU"
        }, {
            name: "Mayotte",
            abbreviation: "YT"
        }, {
            name: "Metropolitan France",
            abbreviation: "FX"
        }, {
            name: "Mexico",
            abbreviation: "MX"
        }, {
            name: "Micronesia",
            abbreviation: "FM"
        }, {
            name: "Midway Islands",
            abbreviation: "MI"
        }, {
            name: "Moldova",
            abbreviation: "MD"
        }, {
            name: "Monaco",
            abbreviation: "MC"
        }, {
            name: "Mongolia",
            abbreviation: "MN"
        }, {
            name: "Montenegro",
            abbreviation: "ME"
        }, {
            name: "Montserrat",
            abbreviation: "MS"
        }, {
            name: "Morocco",
            abbreviation: "MA"
        }, {
            name: "Mozambique",
            abbreviation: "MZ"
        }, {
            name: "Myanmar [Burma]",
            abbreviation: "MM"
        }, {
            name: "Namibia",
            abbreviation: "NA"
        }, {
            name: "Nauru",
            abbreviation: "NR"
        }, {
            name: "Nepal",
            abbreviation: "NP"
        }, {
            name: "Netherlands",
            abbreviation: "NL"
        }, {
            name: "Netherlands Antilles",
            abbreviation: "AN"
        }, {
            name: "Neutral Zone",
            abbreviation: "NT"
        }, {
            name: "New Caledonia",
            abbreviation: "NC"
        }, {
            name: "New Zealand",
            abbreviation: "NZ"
        }, {
            name: "Nicaragua",
            abbreviation: "NI"
        }, {
            name: "Niger",
            abbreviation: "NE"
        }, {
            name: "Nigeria",
            abbreviation: "NG"
        }, {
            name: "Niue",
            abbreviation: "NU"
        }, {
            name: "Norfolk Island",
            abbreviation: "NF"
        }, {
            name: "North Korea",
            abbreviation: "KP"
        }, {
            name: "North Vietnam",
            abbreviation: "VD"
        }, {
            name: "Northern Mariana Islands",
            abbreviation: "MP"
        }, {
            name: "Norway",
            abbreviation: "NO"
        }, {
            name: "Oman",
            abbreviation: "OM"
        }, {
            name: "Pacific Islands Trust Territory",
            abbreviation: "PC"
        }, {
            name: "Pakistan",
            abbreviation: "PK"
        }, {
            name: "Palau",
            abbreviation: "PW"
        }, {
            name: "Palestinian Territories",
            abbreviation: "PS"
        }, {
            name: "Panama",
            abbreviation: "PA"
        }, {
            name: "Panama Canal Zone",
            abbreviation: "PZ"
        }, {
            name: "Papua New Guinea",
            abbreviation: "PG"
        }, {
            name: "Paraguay",
            abbreviation: "PY"
        }, {
            name: "People's Democratic Republic of Yemen",
            abbreviation: "YD"
        }, {
            name: "Peru",
            abbreviation: "PE"
        }, {
            name: "Philippines",
            abbreviation: "PH"
        }, {
            name: "Pitcairn Islands",
            abbreviation: "PN"
        }, {
            name: "Poland",
            abbreviation: "PL"
        }, {
            name: "Portugal",
            abbreviation: "PT"
        }, {
            name: "Puerto Rico",
            abbreviation: "PR"
        }, {
            name: "Qatar",
            abbreviation: "QA"
        }, {
            name: "Romania",
            abbreviation: "RO"
        }, {
            name: "Russia",
            abbreviation: "RU"
        }, {
            name: "Rwanda",
            abbreviation: "RW"
        }, {
            name: "Réunion",
            abbreviation: "RE"
        }, {
            name: "Saint Barthélemy",
            abbreviation: "BL"
        }, {
            name: "Saint Helena",
            abbreviation: "SH"
        }, {
            name: "Saint Kitts and Nevis",
            abbreviation: "KN"
        }, {
            name: "Saint Lucia",
            abbreviation: "LC"
        }, {
            name: "Saint Martin",
            abbreviation: "MF"
        }, {
            name: "Saint Pierre and Miquelon",
            abbreviation: "PM"
        }, {
            name: "Saint Vincent and the Grenadines",
            abbreviation: "VC"
        }, {
            name: "Samoa",
            abbreviation: "WS"
        }, {
            name: "San Marino",
            abbreviation: "SM"
        }, {
            name: "Saudi Arabia",
            abbreviation: "SA"
        }, {
            name: "Senegal",
            abbreviation: "SN"
        }, {
            name: "Serbia",
            abbreviation: "RS"
        }, {
            name: "Serbia and Montenegro",
            abbreviation: "CS"
        }, {
            name: "Seychelles",
            abbreviation: "SC"
        }, {
            name: "Sierra Leone",
            abbreviation: "SL"
        }, {
            name: "Singapore",
            abbreviation: "SG"
        }, {
            name: "Slovakia",
            abbreviation: "SK"
        }, {
            name: "Slovenia",
            abbreviation: "SI"
        }, {
            name: "Solomon Islands",
            abbreviation: "SB"
        }, {
            name: "Somalia",
            abbreviation: "SO"
        }, {
            name: "South Africa",
            abbreviation: "ZA"
        }, {
            name: "South Georgia and the South Sandwich Islands",
            abbreviation: "GS"
        }, {
            name: "South Korea",
            abbreviation: "KR"
        }, {
            name: "Spain",
            abbreviation: "ES"
        }, {
            name: "Sri Lanka",
            abbreviation: "LK"
        }, {
            name: "Sudan",
            abbreviation: "SD"
        }, {
            name: "Suriname",
            abbreviation: "SR"
        }, {
            name: "Svalbard and Jan Mayen",
            abbreviation: "SJ"
        }, {
            name: "Swaziland",
            abbreviation: "SZ"
        }, {
            name: "Sweden",
            abbreviation: "SE"
        }, {
            name: "Switzerland",
            abbreviation: "CH"
        }, {
            name: "Syria",
            abbreviation: "SY"
        }, {
            name: "São Tomé and Príncipe",
            abbreviation: "ST"
        }, {
            name: "Taiwan",
            abbreviation: "TW"
        }, {
            name: "Tajikistan",
            abbreviation: "TJ"
        }, {
            name: "Tanzania",
            abbreviation: "TZ"
        }, {
            name: "Thailand",
            abbreviation: "TH"
        }, {
            name: "Timor-Leste",
            abbreviation: "TL"
        }, {
            name: "Togo",
            abbreviation: "TG"
        }, {
            name: "Tokelau",
            abbreviation: "TK"
        }, {
            name: "Tonga",
            abbreviation: "TO"
        }, {
            name: "Trinidad and Tobago",
            abbreviation: "TT"
        }, {
            name: "Tunisia",
            abbreviation: "TN"
        }, {
            name: "Turkey",
            abbreviation: "TR"
        }, {
            name: "Turkmenistan",
            abbreviation: "TM"
        }, {
            name: "Turks and Caicos Islands",
            abbreviation: "TC"
        }, {
            name: "Tuvalu",
            abbreviation: "TV"
        }, {
            name: "U.S. Minor Outlying Islands",
            abbreviation: "UM"
        }, {
            name: "U.S. Miscellaneous Pacific Islands",
            abbreviation: "PU"
        }, {
            name: "U.S. Virgin Islands",
            abbreviation: "VI"
        }, {
            name: "Uganda",
            abbreviation: "UG"
        }, {
            name: "Ukraine",
            abbreviation: "UA"
        }, {
            name: "Union of Soviet Socialist Republics",
            abbreviation: "SU"
        }, {
            name: "United Arab Emirates",
            abbreviation: "AE"
        }, {
            name: "United Kingdom",
            abbreviation: "GB"
        }, {
            name: "United States",
            abbreviation: "US"
        }, {
            name: "Unknown or Invalid Region",
            abbreviation: "ZZ"
        }, {
            name: "Uruguay",
            abbreviation: "UY"
        }, {
            name: "Uzbekistan",
            abbreviation: "UZ"
        }, {
            name: "Vanuatu",
            abbreviation: "VU"
        }, {
            name: "Vatican City",
            abbreviation: "VA"
        }, {
            name: "Venezuela",
            abbreviation: "VE"
        }, {
            name: "Vietnam",
            abbreviation: "VN"
        }, {
            name: "Wake Island",
            abbreviation: "WK"
        }, {
            name: "Wallis and Futuna",
            abbreviation: "WF"
        }, {
            name: "Western Sahara",
            abbreviation: "EH"
        }, {
            name: "Yemen",
            abbreviation: "YE"
        }, {
            name: "Zambia",
            abbreviation: "ZM"
        }, {
            name: "Zimbabwe",
            abbreviation: "ZW"
        }, {
            name: "Åland Islands",
            abbreviation: "AX"
        }],
        provinces: [{
            name: "Alberta",
            abbreviation: "AB"
        }, {
            name: "British Columbia",
            abbreviation: "BC"
        }, {
            name: "Manitoba",
            abbreviation: "MB"
        }, {
            name: "New Brunswick",
            abbreviation: "NB"
        }, {
            name: "Newfoundland and Labrador",
            abbreviation: "NL"
        }, {
            name: "Nova Scotia",
            abbreviation: "NS"
        }, {
            name: "Ontario",
            abbreviation: "ON"
        }, {
            name: "Prince Edward Island",
            abbreviation: "PE"
        }, {
            name: "Quebec",
            abbreviation: "QC"
        }, {
            name: "Saskatchewan",
            abbreviation: "SK"
        }, {
            name: "Northwest Territories",
            abbreviation: "NT"
        }, {
            name: "Nunavut",
            abbreviation: "NU"
        }, {
            name: "Yukon",
            abbreviation: "YT"
        }],
        us_states_and_dc: [{
            name: "Alabama",
            abbreviation: "AL"
        }, {
            name: "Alaska",
            abbreviation: "AK"
        }, {
            name: "Arizona",
            abbreviation: "AZ"
        }, {
            name: "Arkansas",
            abbreviation: "AR"
        }, {
            name: "California",
            abbreviation: "CA"
        }, {
            name: "Colorado",
            abbreviation: "CO"
        }, {
            name: "Connecticut",
            abbreviation: "CT"
        }, {
            name: "Delaware",
            abbreviation: "DE"
        }, {
            name: "District of Columbia",
            abbreviation: "DC"
        }, {
            name: "Florida",
            abbreviation: "FL"
        }, {
            name: "Georgia",
            abbreviation: "GA"
        }, {
            name: "Hawaii",
            abbreviation: "HI"
        }, {
            name: "Idaho",
            abbreviation: "ID"
        }, {
            name: "Illinois",
            abbreviation: "IL"
        }, {
            name: "Indiana",
            abbreviation: "IN"
        }, {
            name: "Iowa",
            abbreviation: "IA"
        }, {
            name: "Kansas",
            abbreviation: "KS"
        }, {
            name: "Kentucky",
            abbreviation: "KY"
        }, {
            name: "Louisiana",
            abbreviation: "LA"
        }, {
            name: "Maine",
            abbreviation: "ME"
        }, {
            name: "Maryland",
            abbreviation: "MD"
        }, {
            name: "Massachusetts",
            abbreviation: "MA"
        }, {
            name: "Michigan",
            abbreviation: "MI"
        }, {
            name: "Minnesota",
            abbreviation: "MN"
        }, {
            name: "Mississippi",
            abbreviation: "MS"
        }, {
            name: "Missouri",
            abbreviation: "MO"
        }, {
            name: "Montana",
            abbreviation: "MT"
        }, {
            name: "Nebraska",
            abbreviation: "NE"
        }, {
            name: "Nevada",
            abbreviation: "NV"
        }, {
            name: "New Hampshire",
            abbreviation: "NH"
        }, {
            name: "New Jersey",
            abbreviation: "NJ"
        }, {
            name: "New Mexico",
            abbreviation: "NM"
        }, {
            name: "New York",
            abbreviation: "NY"
        }, {
            name: "North Carolina",
            abbreviation: "NC"
        }, {
            name: "North Dakota",
            abbreviation: "ND"
        }, {
            name: "Ohio",
            abbreviation: "OH"
        }, {
            name: "Oklahoma",
            abbreviation: "OK"
        }, {
            name: "Oregon",
            abbreviation: "OR"
        }, {
            name: "Pennsylvania",
            abbreviation: "PA"
        }, {
            name: "Rhode Island",
            abbreviation: "RI"
        }, {
            name: "South Carolina",
            abbreviation: "SC"
        }, {
            name: "South Dakota",
            abbreviation: "SD"
        }, {
            name: "Tennessee",
            abbreviation: "TN"
        }, {
            name: "Texas",
            abbreviation: "TX"
        }, {
            name: "Utah",
            abbreviation: "UT"
        }, {
            name: "Vermont",
            abbreviation: "VT"
        }, {
            name: "Virginia",
            abbreviation: "VA"
        }, {
            name: "Washington",
            abbreviation: "WA"
        }, {
            name: "West Virginia",
            abbreviation: "WV"
        }, {
            name: "Wisconsin",
            abbreviation: "WI"
        }, {
            name: "Wyoming",
            abbreviation: "WY"
        }],
        territories: [{
            name: "American Samoa",
            abbreviation: "AS"
        }, {
            name: "Federated States of Micronesia",
            abbreviation: "FM"
        }, {
            name: "Guam",
            abbreviation: "GU"
        }, {
            name: "Marshall Islands",
            abbreviation: "MH"
        }, {
            name: "Northern Mariana Islands",
            abbreviation: "MP"
        }, {
            name: "Puerto Rico",
            abbreviation: "PR"
        }, {
            name: "Virgin Islands, U.S.",
            abbreviation: "VI"
        }],
        armed_forces: [{
            name: "Armed Forces Europe",
            abbreviation: "AE"
        }, {
            name: "Armed Forces Pacific",
            abbreviation: "AP"
        }, {
            name: "Armed Forces the Americas",
            abbreviation: "AA"
        }],
        street_suffixes: [{
            name: "Avenue",
            abbreviation: "Ave"
        }, {
            name: "Boulevard",
            abbreviation: "Blvd"
        }, {
            name: "Center",
            abbreviation: "Ctr"
        }, {
            name: "Circle",
            abbreviation: "Cir"
        }, {
            name: "Court",
            abbreviation: "Ct"
        }, {
            name: "Drive",
            abbreviation: "Dr"
        }, {
            name: "Extension",
            abbreviation: "Ext"
        }, {
            name: "Glen",
            abbreviation: "Gln"
        }, {
            name: "Grove",
            abbreviation: "Grv"
        }, {
            name: "Heights",
            abbreviation: "Hts"
        }, {
            name: "Highway",
            abbreviation: "Hwy"
        }, {
            name: "Junction",
            abbreviation: "Jct"
        }, {
            name: "Key",
            abbreviation: "Key"
        }, {
            name: "Lane",
            abbreviation: "Ln"
        }, {
            name: "Loop",
            abbreviation: "Loop"
        }, {
            name: "Manor",
            abbreviation: "Mnr"
        }, {
            name: "Mill",
            abbreviation: "Mill"
        }, {
            name: "Park",
            abbreviation: "Park"
        }, {
            name: "Parkway",
            abbreviation: "Pkwy"
        }, {
            name: "Pass",
            abbreviation: "Pass"
        }, {
            name: "Path",
            abbreviation: "Path"
        }, {
            name: "Pike",
            abbreviation: "Pike"
        }, {
            name: "Place",
            abbreviation: "Pl"
        }, {
            name: "Plaza",
            abbreviation: "Plz"
        }, {
            name: "Point",
            abbreviation: "Pt"
        }, {
            name: "Ridge",
            abbreviation: "Rdg"
        }, {
            name: "River",
            abbreviation: "Riv"
        }, {
            name: "Road",
            abbreviation: "Rd"
        }, {
            name: "Square",
            abbreviation: "Sq"
        }, {
            name: "Street",
            abbreviation: "St"
        }, {
            name: "Terrace",
            abbreviation: "Ter"
        }, {
            name: "Trail",
            abbreviation: "Trl"
        }, {
            name: "Turnpike",
            abbreviation: "Tpke"
        }, {
            name: "View",
            abbreviation: "Vw"
        }, {
            name: "Way",
            abbreviation: "Way"
        }],
        months: [{
            name: "January",
            short_name: "Jan",
            numeric: "01",
            days: 31
        }, {
            name: "February",
            short_name: "Feb",
            numeric: "02",
            days: 28
        }, {
            name: "March",
            short_name: "Mar",
            numeric: "03",
            days: 31
        }, {
            name: "April",
            short_name: "Apr",
            numeric: "04",
            days: 30
        }, {
            name: "May",
            short_name: "May",
            numeric: "05",
            days: 31
        }, {
            name: "June",
            short_name: "Jun",
            numeric: "06",
            days: 30
        }, {
            name: "July",
            short_name: "Jul",
            numeric: "07",
            days: 31
        }, {
            name: "August",
            short_name: "Aug",
            numeric: "08",
            days: 31
        }, {
            name: "September",
            short_name: "Sep",
            numeric: "09",
            days: 30
        }, {
            name: "October",
            short_name: "Oct",
            numeric: "10",
            days: 31
        }, {
            name: "November",
            short_name: "Nov",
            numeric: "11",
            days: 30
        }, {
            name: "December",
            short_name: "Dec",
            numeric: "12",
            days: 31
        }],
        cc_types: [{
            name: "American Express",
            short_name: "amex",
            prefix: "34",
            length: 15
        }, {
            name: "Bankcard",
            short_name: "bankcard",
            prefix: "5610",
            length: 16
        }, {
            name: "China UnionPay",
            short_name: "chinaunion",
            prefix: "62",
            length: 16
        }, {
            name: "Diners Club Carte Blanche",
            short_name: "dccarte",
            prefix: "300",
            length: 14
        }, {
            name: "Diners Club enRoute",
            short_name: "dcenroute",
            prefix: "2014",
            length: 15
        }, {
            name: "Diners Club International",
            short_name: "dcintl",
            prefix: "36",
            length: 14
        }, {
            name: "Diners Club United States & Canada",
            short_name: "dcusc",
            prefix: "54",
            length: 16
        }, {
            name: "Discover Card",
            short_name: "discover",
            prefix: "6011",
            length: 16
        }, {
            name: "InstaPayment",
            short_name: "instapay",
            prefix: "637",
            length: 16
        }, {
            name: "JCB",
            short_name: "jcb",
            prefix: "3528",
            length: 16
        }, {
            name: "Laser",
            short_name: "laser",
            prefix: "6304",
            length: 16
        }, {
            name: "Maestro",
            short_name: "maestro",
            prefix: "5018",
            length: 16
        }, {
            name: "Mastercard",
            short_name: "mc",
            prefix: "51",
            length: 16
        }, {
            name: "Solo",
            short_name: "solo",
            prefix: "6334",
            length: 16
        }, {
            name: "Switch",
            short_name: "switch",
            prefix: "4903",
            length: 16
        }, {
            name: "Visa",
            short_name: "visa",
            prefix: "4",
            length: 16
        }, {
            name: "Visa Electron",
            short_name: "electron",
            prefix: "4026",
            length: 16
        }],
        currency_types: [{
            code: "AED",
            name: "United Arab Emirates Dirham"
        }, {
            code: "AFN",
            name: "Afghanistan Afghani"
        }, {
            code: "ALL",
            name: "Albania Lek"
        }, {
            code: "AMD",
            name: "Armenia Dram"
        }, {
            code: "ANG",
            name: "Netherlands Antilles Guilder"
        }, {
            code: "AOA",
            name: "Angola Kwanza"
        }, {
            code: "ARS",
            name: "Argentina Peso"
        }, {
            code: "AUD",
            name: "Australia Dollar"
        }, {
            code: "AWG",
            name: "Aruba Guilder"
        }, {
            code: "AZN",
            name: "Azerbaijan New Manat"
        }, {
            code: "BAM",
            name: "Bosnia and Herzegovina Convertible Marka"
        }, {
            code: "BBD",
            name: "Barbados Dollar"
        }, {
            code: "BDT",
            name: "Bangladesh Taka"
        }, {
            code: "BGN",
            name: "Bulgaria Lev"
        }, {
            code: "BHD",
            name: "Bahrain Dinar"
        }, {
            code: "BIF",
            name: "Burundi Franc"
        }, {
            code: "BMD",
            name: "Bermuda Dollar"
        }, {
            code: "BND",
            name: "Brunei Darussalam Dollar"
        }, {
            code: "BOB",
            name: "Bolivia Boliviano"
        }, {
            code: "BRL",
            name: "Brazil Real"
        }, {
            code: "BSD",
            name: "Bahamas Dollar"
        }, {
            code: "BTN",
            name: "Bhutan Ngultrum"
        }, {
            code: "BWP",
            name: "Botswana Pula"
        }, {
            code: "BYR",
            name: "Belarus Ruble"
        }, {
            code: "BZD",
            name: "Belize Dollar"
        }, {
            code: "CAD",
            name: "Canada Dollar"
        }, {
            code: "CDF",
            name: "Congo/Kinshasa Franc"
        }, {
            code: "CHF",
            name: "Switzerland Franc"
        }, {
            code: "CLP",
            name: "Chile Peso"
        }, {
            code: "CNY",
            name: "China Yuan Renminbi"
        }, {
            code: "COP",
            name: "Colombia Peso"
        }, {
            code: "CRC",
            name: "Costa Rica Colon"
        }, {
            code: "CUC",
            name: "Cuba Convertible Peso"
        }, {
            code: "CUP",
            name: "Cuba Peso"
        }, {
            code: "CVE",
            name: "Cape Verde Escudo"
        }, {
            code: "CZK",
            name: "Czech Republic Koruna"
        }, {
            code: "DJF",
            name: "Djibouti Franc"
        }, {
            code: "DKK",
            name: "Denmark Krone"
        }, {
            code: "DOP",
            name: "Dominican Republic Peso"
        }, {
            code: "DZD",
            name: "Algeria Dinar"
        }, {
            code: "EGP",
            name: "Egypt Pound"
        }, {
            code: "ERN",
            name: "Eritrea Nakfa"
        }, {
            code: "ETB",
            name: "Ethiopia Birr"
        }, {
            code: "EUR",
            name: "Euro Member Countries"
        }, {
            code: "FJD",
            name: "Fiji Dollar"
        }, {
            code: "FKP",
            name: "Falkland Islands (Malvinas) Pound"
        }, {
            code: "GBP",
            name: "United Kingdom Pound"
        }, {
            code: "GEL",
            name: "Georgia Lari"
        }, {
            code: "GGP",
            name: "Guernsey Pound"
        }, {
            code: "GHS",
            name: "Ghana Cedi"
        }, {
            code: "GIP",
            name: "Gibraltar Pound"
        }, {
            code: "GMD",
            name: "Gambia Dalasi"
        }, {
            code: "GNF",
            name: "Guinea Franc"
        }, {
            code: "GTQ",
            name: "Guatemala Quetzal"
        }, {
            code: "GYD",
            name: "Guyana Dollar"
        }, {
            code: "HKD",
            name: "Hong Kong Dollar"
        }, {
            code: "HNL",
            name: "Honduras Lempira"
        }, {
            code: "HRK",
            name: "Croatia Kuna"
        }, {
            code: "HTG",
            name: "Haiti Gourde"
        }, {
            code: "HUF",
            name: "Hungary Forint"
        }, {
            code: "IDR",
            name: "Indonesia Rupiah"
        }, {
            code: "ILS",
            name: "Israel Shekel"
        }, {
            code: "IMP",
            name: "Isle of Man Pound"
        }, {
            code: "INR",
            name: "India Rupee"
        }, {
            code: "IQD",
            name: "Iraq Dinar"
        }, {
            code: "IRR",
            name: "Iran Rial"
        }, {
            code: "ISK",
            name: "Iceland Krona"
        }, {
            code: "JEP",
            name: "Jersey Pound"
        }, {
            code: "JMD",
            name: "Jamaica Dollar"
        }, {
            code: "JOD",
            name: "Jordan Dinar"
        }, {
            code: "JPY",
            name: "Japan Yen"
        }, {
            code: "KES",
            name: "Kenya Shilling"
        }, {
            code: "KGS",
            name: "Kyrgyzstan Som"
        }, {
            code: "KHR",
            name: "Cambodia Riel"
        }, {
            code: "KMF",
            name: "Comoros Franc"
        }, {
            code: "KPW",
            name: "Korea (North) Won"
        }, {
            code: "KRW",
            name: "Korea (South) Won"
        }, {
            code: "KWD",
            name: "Kuwait Dinar"
        }, {
            code: "KYD",
            name: "Cayman Islands Dollar"
        }, {
            code: "KZT",
            name: "Kazakhstan Tenge"
        }, {
            code: "LAK",
            name: "Laos Kip"
        }, {
            code: "LBP",
            name: "Lebanon Pound"
        }, {
            code: "LKR",
            name: "Sri Lanka Rupee"
        }, {
            code: "LRD",
            name: "Liberia Dollar"
        }, {
            code: "LSL",
            name: "Lesotho Loti"
        }, {
            code: "LTL",
            name: "Lithuania Litas"
        }, {
            code: "LYD",
            name: "Libya Dinar"
        }, {
            code: "MAD",
            name: "Morocco Dirham"
        }, {
            code: "MDL",
            name: "Moldova Leu"
        }, {
            code: "MGA",
            name: "Madagascar Ariary"
        }, {
            code: "MKD",
            name: "Macedonia Denar"
        }, {
            code: "MMK",
            name: "Myanmar (Burma) Kyat"
        }, {
            code: "MNT",
            name: "Mongolia Tughrik"
        }, {
            code: "MOP",
            name: "Macau Pataca"
        }, {
            code: "MRO",
            name: "Mauritania Ouguiya"
        }, {
            code: "MUR",
            name: "Mauritius Rupee"
        }, {
            code: "MVR",
            name: "Maldives (Maldive Islands) Rufiyaa"
        }, {
            code: "MWK",
            name: "Malawi Kwacha"
        }, {
            code: "MXN",
            name: "Mexico Peso"
        }, {
            code: "MYR",
            name: "Malaysia Ringgit"
        }, {
            code: "MZN",
            name: "Mozambique Metical"
        }, {
            code: "NAD",
            name: "Namibia Dollar"
        }, {
            code: "NGN",
            name: "Nigeria Naira"
        }, {
            code: "NIO",
            name: "Nicaragua Cordoba"
        }, {
            code: "NOK",
            name: "Norway Krone"
        }, {
            code: "NPR",
            name: "Nepal Rupee"
        }, {
            code: "NZD",
            name: "New Zealand Dollar"
        }, {
            code: "OMR",
            name: "Oman Rial"
        }, {
            code: "PAB",
            name: "Panama Balboa"
        }, {
            code: "PEN",
            name: "Peru Nuevo Sol"
        }, {
            code: "PGK",
            name: "Papua New Guinea Kina"
        }, {
            code: "PHP",
            name: "Philippines Peso"
        }, {
            code: "PKR",
            name: "Pakistan Rupee"
        }, {
            code: "PLN",
            name: "Poland Zloty"
        }, {
            code: "PYG",
            name: "Paraguay Guarani"
        }, {
            code: "QAR",
            name: "Qatar Riyal"
        }, {
            code: "RON",
            name: "Romania New Leu"
        }, {
            code: "RSD",
            name: "Serbia Dinar"
        }, {
            code: "RUB",
            name: "Russia Ruble"
        }, {
            code: "RWF",
            name: "Rwanda Franc"
        }, {
            code: "SAR",
            name: "Saudi Arabia Riyal"
        }, {
            code: "SBD",
            name: "Solomon Islands Dollar"
        }, {
            code: "SCR",
            name: "Seychelles Rupee"
        }, {
            code: "SDG",
            name: "Sudan Pound"
        }, {
            code: "SEK",
            name: "Sweden Krona"
        }, {
            code: "SGD",
            name: "Singapore Dollar"
        }, {
            code: "SHP",
            name: "Saint Helena Pound"
        }, {
            code: "SLL",
            name: "Sierra Leone Leone"
        }, {
            code: "SOS",
            name: "Somalia Shilling"
        }, {
            code: "SPL",
            name: "Seborga Luigino"
        }, {
            code: "SRD",
            name: "Suriname Dollar"
        }, {
            code: "STD",
            name: "São Tomé and Príncipe Dobra"
        }, {
            code: "SVC",
            name: "El Salvador Colon"
        }, {
            code: "SYP",
            name: "Syria Pound"
        }, {
            code: "SZL",
            name: "Swaziland Lilangeni"
        }, {
            code: "THB",
            name: "Thailand Baht"
        }, {
            code: "TJS",
            name: "Tajikistan Somoni"
        }, {
            code: "TMT",
            name: "Turkmenistan Manat"
        }, {
            code: "TND",
            name: "Tunisia Dinar"
        }, {
            code: "TOP",
            name: "Tonga Pa'anga"
        }, {
            code: "TRY",
            name: "Turkey Lira"
        }, {
            code: "TTD",
            name: "Trinidad and Tobago Dollar"
        }, {
            code: "TVD",
            name: "Tuvalu Dollar"
        }, {
            code: "TWD",
            name: "Taiwan New Dollar"
        }, {
            code: "TZS",
            name: "Tanzania Shilling"
        }, {
            code: "UAH",
            name: "Ukraine Hryvnia"
        }, {
            code: "UGX",
            name: "Uganda Shilling"
        }, {
            code: "USD",
            name: "United States Dollar"
        }, {
            code: "UYU",
            name: "Uruguay Peso"
        }, {
            code: "UZS",
            name: "Uzbekistan Som"
        }, {
            code: "VEF",
            name: "Venezuela Bolivar"
        }, {
            code: "VND",
            name: "Viet Nam Dong"
        }, {
            code: "VUV",
            name: "Vanuatu Vatu"
        }, {
            code: "WST",
            name: "Samoa Tala"
        }, {
            code: "XAF",
            name: "Communauté Financière Africaine (BEAC) CFA Franc BEAC"
        }, {
            code: "XCD",
            name: "East Caribbean Dollar"
        }, {
            code: "XDR",
            name: "International Monetary Fund (IMF) Special Drawing Rights"
        }, {
            code: "XOF",
            name: "Communauté Financière Africaine (BCEAO) Franc"
        }, {
            code: "XPF",
            name: "Comptoirs Français du Pacifique (CFP) Franc"
        }, {
            code: "YER",
            name: "Yemen Rial"
        }, {
            code: "ZAR",
            name: "South Africa Rand"
        }, {
            code: "ZMW",
            name: "Zambia Kwacha"
        }, {
            code: "ZWD",
            name: "Zimbabwe Dollar"
        }]
    }, q = Object.prototype.hasOwnProperty,
        r = Object.keys || function (a) {
            var b = [];
            for (var c in a) q.call(a, c) && b.push(c);
            return b
        };
    a.prototype.get = function (a) {
        return g(p[a])
    }, a.prototype.mac_address = function (a) {
        a = b(a), a.separator || (a.separator = a.networkVersion ? "." : ":");
        var c = "ABCDEF1234567890",
            d = "";
        return d = a.networkVersion ? this.n(this.string, 3, {
            pool: c,
            length: 4
        }).join(a.separator) : this.n(this.string, 6, {
            pool: c,
            length: 2
        }).join(a.separator)
    }, a.prototype.normal = function (a) {
        a = b(a, {
            mean: 0,
            dev: 1
        });
        var c, d, e, f, g = a.mean,
            h = a.dev;
        do d = 2 * this.random() - 1, e = 2 * this.random() - 1, c = d * d + e * e;
        while (c >= 1);
        return f = d * Math.sqrt(-2 * Math.log(c) / c), h * f + g
    }, a.prototype.radio = function (a) {
        a = b(a, {
            side: "?"
        });
        var c = "";
        switch (a.side.toLowerCase()) {
            case "east":
            case "e":
                c = "W";
                break;
            case "west":
            case "w":
                c = "K";
                break;
            default:
                c = this.character({
                    pool: "KW"
                })
        }
        return c + this.character({
            alpha: !0,
            casing: "upper"
        }) + this.character({
            alpha: !0,
            casing: "upper"
        }) + this.character({
            alpha: !0,
            casing: "upper"
        })
    }, a.prototype.set = function (a, b) {
        "string" == typeof a ? p[a] = b : p = g(a, p)
    }, a.prototype.tv = function (a) {
        return this.radio(a)
    }, a.prototype.cnpj = function () {
        var a = this.n(this.natural, 8, {
            max: 9
        }),
            b = 2 + 6 * a[7] + 7 * a[6] + 8 * a[5] + 9 * a[4] + 2 * a[3] + 3 * a[2] + 4 * a[1] + 5 * a[0];
        b = 11 - b % 11, b >= 10 && (b = 0);
        var c = 2 * b + 3 + 7 * a[7] + 8 * a[6] + 9 * a[5] + 2 * a[4] + 3 * a[3] + 4 * a[2] + 5 * a[1] + 6 * a[0];
        return c = 11 - c % 11, c >= 10 && (c = 0), "" + a[0] + a[1] + "." + a[2] + a[3] + a[4] + "." + a[5] + a[6] + a[7] + "/0001-" + b + c
    }, a.prototype.mersenne_twister = function (a) {
        return new s(a)
    };
    var s = function (a) {
        void 0 === a && (a = (new Date).getTime()), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, this.init_genrand(a)
    };
    s.prototype.init_genrand = function (a) {
        for (this.mt[0] = a >>> 0, this.mti = 1; this.mti < this.N; this.mti++) a = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30, this.mt[this.mti] = (1812433253 * ((4294901760 & a) >>> 16) << 16) + 1812433253 * (65535 & a) + this.mti, this.mt[this.mti] >>>= 0
    }, s.prototype.init_by_array = function (a, b) {
        var c, d, e = 1,
            f = 0;
        for (this.init_genrand(19650218), c = this.N > b ? this.N : b; c; c--) d = this.mt[e - 1] ^ this.mt[e - 1] >>> 30, this.mt[e] = (this.mt[e] ^ (1664525 * ((4294901760 & d) >>> 16) << 16) + 1664525 * (65535 & d)) + a[f] + f, this.mt[e] >>>= 0, e++, f++, e >= this.N && (this.mt[0] = this.mt[this.N - 1], e = 1), f >= b && (f = 0);
        for (c = this.N - 1; c; c--) d = this.mt[e - 1] ^ this.mt[e - 1] >>> 30, this.mt[e] = (this.mt[e] ^ (1566083941 * ((4294901760 & d) >>> 16) << 16) + 1566083941 * (65535 & d)) - e, this.mt[e] >>>= 0, e++, e >= this.N && (this.mt[0] = this.mt[this.N - 1], e = 1);
        this.mt[0] = 2147483648
    }, s.prototype.genrand_int32 = function () {
        var a, b = new Array(0, this.MATRIX_A);
        if (this.mti >= this.N) {
            var c;
            for (this.mti === this.N + 1 && this.init_genrand(5489), c = 0; c < this.N - this.M; c++) a = this.mt[c] & this.UPPER_MASK | this.mt[c + 1] & this.LOWER_MASK, this.mt[c] = this.mt[c + this.M] ^ a >>> 1 ^ b[1 & a];
            for (; c < this.N - 1; c++) a = this.mt[c] & this.UPPER_MASK | this.mt[c + 1] & this.LOWER_MASK, this.mt[c] = this.mt[c + (this.M - this.N)] ^ a >>> 1 ^ b[1 & a];
            a = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ a >>> 1 ^ b[1 & a], this.mti = 0
        }
        return a = this.mt[this.mti++], a ^= a >>> 11, a ^= a << 7 & 2636928640, a ^= a << 15 & 4022730752, a ^= a >>> 18, a >>> 0
    }, s.prototype.genrand_int31 = function () {
        return this.genrand_int32() >>> 1
    }, s.prototype.genrand_real1 = function () {
        return this.genrand_int32() * (1 / 4294967295)
    }, s.prototype.random = function () {
        return this.genrand_int32() * (1 / 4294967296)
    }, s.prototype.genrand_real3 = function () {
        return (this.genrand_int32() + .5) * (1 / 4294967296)
    }, s.prototype.genrand_res53 = function () {
        var a = this.genrand_int32() >>> 5,
            b = this.genrand_int32() >>> 6;
        return (67108864 * a + b) * (1 / 9007199254740992)
    }, "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (exports = module.exports = a), exports.Chance = a), "function" == typeof define && define.amd && define([], function () {
        return a
    }), "undefined" != typeof importScripts && (chance = new a), "object" == typeof window && "object" == typeof window.document && (window.Chance = a, window.chance = new a)
}();