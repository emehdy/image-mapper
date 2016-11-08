!function ($) {
	var b = 0,
	c = {},
	d = {
		defaults : {
			src : "",
			file : "",
			style : {
				fill : "#666",
				stroke : "#333",
				strokeWidth : "1",
				opacity : "0.6",
				cursor : "pointer"
			},
			pointStyle : {
				fill : "#fff",
				stroke : "#333",
				strokeWidth : "1",
				opacity : "0.6",
				cursor : "pointer"
			},
			event : {
				init : function () {},
				update : function () {},
				addArea : function () {},
				removeArea : function () {}
			},
			input : {
				active : {
					selector : 'input[name^="im["][name$="][active]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				},
				shape : {
					selector : 'select[name^="im["][name$="][shape]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				},
				href : {
					selector : 'input[name^="im["][name$="][href]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				},
				title : {
					selector : 'input[name^="im["][name$="][title]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				},
				target : {
					selector : 'select[name^="im["][name$="][target]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				},
				remove : {
					selector : 'button[name^="im["][name$="][remove]"]',
					fn : function () {
						return $(this).attr("name").match(/im\[([\d]+)\]\[([^\)]+)\]/).slice(1)
					}
				}
			}
		},
		init : function (e, f) {
			var g = this,
			h = $(this),
			f = f || {};
			if (!e) {
				f = $.extend(!0, d.defaults, f),
				c[b] = {
					state : {
						isLoaded : !1,
						areaIndex : 0,
						areaLength : 0
					},
					area : [],
					options : f
				},
				e = b,
				h.data("imageMapper", b++),
				h.addClass("image-mapper"),
				h.html('<img class="image-mapper-img" /><svg class="image-mapper-svg" />');
				var i = $(".image-mapper-img", h);
				i[0].onload = function () {
					c[e].state.isLoaded = !0
				},
				c[e].options.src.length > 0 && i.attr("src", c[e].options.src),
				d.bindEvents.apply(this, [e]),
				d.bindInputs.apply(this, [e]),
				d.addArea(e, "rect"),
				"function" == typeof c[e].options.event.init && c[e].options.event.init.apply(g),
				d.bindValues(e)
			}
		},
		update : function (b, e) {
			var f = this,
			g = $(this),
			e = e || {};
			if (b >= 0) {
				e = $.extend(!0, c[b].options, e),
				c[b] = {
					state : {
						isLoaded : !1,
						areaIndex : 0,
						areaLength : 0
					},
					area : [],
					options : e
				};
				var h = $(".image-mapper-img", g);
				"src" in e && h.attr("src", c[b].options.src),
				d.addArea(b, "rect"),
				d.refresh.apply(this, [b]),
				"function" == typeof c[b].options.event.update && c[b].options.event.update.apply(f)
			}
		},
		bindEvents : function (b) {
			var e = this,
			f = $(this);
			$(window).on("resize", function () {
				d.refresh.apply(e, [b])
			}),
			f.on("click", function ($) {
				var f = d.getPosition.apply(e, [b, $]);
				d.addPoint.apply(e, [b, f]),
				"function" == typeof c[b].options.event.update && c[b].options.event.update.apply(e)
			});
			var g,
			h;
			f.on("mousemove touchmove", function (f) {
				if (!g)
					return !0;
				var i = "undefined" != typeof f.originalEvent.touches || !1,
				j = d.getPosition.apply(e, [b, f, i]),
				k = d.getClientPosition.apply(e, [b, j]),
				l = d.getRatio.apply(e),
				m = g.data("areaIndex"),
				n = $(".image-mapper-img", e),
				o = [],
				p = !1;
				$.each(c[b].area[m].coords, function ($, b) {
					var c = {
						naturalX : b.naturalX + Math.round((k.clientX - h.clientX) * l.ratioX),
						naturalY : b.naturalY + Math.round((k.clientY - h.clientY) * l.ratioY)
					};
					c.naturalX < 0 || c.naturalX >= n[0].naturalWidth ? p = !0 : (c.naturalY < 0 || c.naturalY >= n[0].naturalHeight) && (p = !0),
					o[$] = c
				}),
				p || (c[b].area[m].coords = o, d.refresh.apply(e, [b])),
				h = k,
				f.preventDefault(),
				f.stopImmediatePropagation()
			}),
			f.on("mouseup touchend mouseleave touchleave", function ($) {
				var b = "undefined" != typeof $.originalEvent.touches || !1;
				g && (0 === $.button || b) && (g = !1)
			}),
			f.on("mousedown touchstart", ".image-mapper-shape", function (c) {
				var f = "undefined" != typeof c.originalEvent.touches || !1;
				if (0 === c.button || f) {
					var i = d.getPosition.apply(e, [b, c, f]),
					j = d.getClientPosition.apply(e, [b, i]);
					g = $(this),
					h = j
				}
			});
			var i;
			f.on("mousemove touchmove", function ($) {
				if (!i)
					return !0;
				var f = "undefined" != typeof $.originalEvent.touches || !1,
				g = d.getPosition.apply(e, [b, $, f]),
				h = d.getClientPosition.apply(e, [b, g]);
				c[b].area[i.data("areaIndex")].coords[i.data("coordIndex")] = g,
				i.attr("cx", h.clientX).attr("cy", h.clientY),
				d.renderSVG.apply(e, [b]),
				$.preventDefault(),
				$.stopImmediatePropagation()
			}),
			f.on("mouseup touchend mouseleave touchleave", function ($) {
				var b = "undefined" != typeof $.originalEvent.touches || !1;
				i && (0 === $.button || b) && (i = !1)
			}),
			f.on("mousedown touchstart", ".image-mapper-point", function (b) {
				var c = "undefined" != typeof b.originalEvent.touches || !1;
				(0 === b.button || c) && (i = $(this))
			}),
			f.on("click", ".image-mapper-point", function ($) {
				$.preventDefault(),
				$.stopImmediatePropagation()
			}),
			f.on("mouseup touchend", ".image-mapper-point", function (f) {
				2 == f.button && (c[b].area[$(this).data("areaIndex")].coords.splice($(this).data("coordIndex"), 1), d.refresh.apply(e, [b]))
			}),
			f.on("contextmenu", function ($) {
				$.preventDefault()
			})
		},
		bindValues : function (b) {
			$.each(c[b].options.input, function (d, e) {
				var f = $(e.selector);
				f.each(function () {
					var d = e.fn.apply(this);
					"active" == d[1] ? $(this).attr("checked", d[0] == c[b].state.areaIndex ? "checked" : !1) : $(this).val(c[b].area[d[0]][d[1]])
				})
			})
		},
		bindInputs : function (b) {
			var e = this;
			$.each(c[b].options.input, function (f, g) {
				var h = $(g.selector);
				h.is("button") ? $(document).on("click", g.selector, function () {
					var $ = g.fn.apply(this);
					"remove" == $[1] && (d.removeArea.apply(e, [b, $[0]]), d.refresh.apply(e, [b]))
				}) : $(document).on("change", g.selector, function () {
					var f = $(this),
					h = g.fn.apply(this),
					i = f.val();
					"active" == h[1] ? ($(g.selector).not(this).attr("checked", !1), c[b].state.areaIndex = h[0], d.refresh.apply(e, [b])) : c[b].area[h[0]][h[1]] = i
				})
			})
		},
		getData : function ($) {
			return c[$]
		},
		getRatio : function () {
			var b = $(".image-mapper-img", this);
			return {
				ratioX : b[0].naturalWidth / b[0].clientWidth,
				ratioY : b[0].naturalHeight / b[0].clientHeight
			}
		},
		getPosition : function (b, c, e) {
			var f = $(".image-mapper-img", this),
			g = f.offset(),
			h = d.getRatio.apply(this, [b]),
			i = {
				naturalX : 0,
				naturalY : 0
			};
			return e ? (i.naturalX = Math.round((c.originalEvent.targetTouches[0].pageX - g.left) * h.ratioX), i.naturalY = Math.round((c.originalEvent.targetTouches[0].pageY - g.top) * h.ratioY)) : (i.naturalX = Math.round((c.clientX + (window.scrollX || window.pageXOffset) - g.left) * h.ratioX), i.naturalY = Math.round((c.clientY + (window.scrollY || window.pageYOffset) - g.top) * h.ratioY)),
			i
		},
		getClientPosition : function (b, c) {
			var e = $(".image-mapper-img", this),
			f = (e.offset(), d.getRatio.apply(this, [b])),
			g = {
				clientX : 0,
				clientY : 0
			};
			return g.clientX = Math.round(c.naturalX / f.ratioX),
			g.clientY = Math.round(c.naturalY / f.ratioY),
			g
		},
		refresh : function ($) {
			d.renderSVG.apply(this, [$]),
			d.renderPoints.apply(this, [$])
		},
		addPoint : function ($, b) {
			d.addCoord($, b),
			d.refresh.apply(this, [$])
		},
		addArea : function (b, d) {
			1 == arguments.length && (d = b, b = $(this).data("imageMapper")),
			c[b].area[c[b].state.areaLength] = {
				el : !1,
				shape : d,
				href : "",
				title : "",
				target : "",
				coords : []
			},
			c[b].state.areaLength++,
			"function" == typeof c[b].options.event.addArea && c[b].options.event.addArea.apply(this)
		},
		removeArea : function ($, b) {
			c[$].area.splice(b, 1),
			c[$].state.areaLength--,
			c[$].state.areaIndex >= c[$].state.areaLength ? c[$].state.areaIndex = 0 : c[$].state.areaIndex == b && 0 !== b && c[$].state.areaIndex--,
			0 === c[$].state.areaLength && d.addArea($, "rect"),
			"function" == typeof c[$].options.event.removeArea && c[$].options.event.removeArea.apply(this)
		},
		addCoord : function ($, b) {
			var d = c[$].state.areaIndex,
			e = c[$].area[d].shape;
			(-1 == ["circle", "rect"].indexOf(e) || 2 != c[$].area[d].coords.length) && c[$].area[d].coords.push(b)
		},
		renderSVG : function (b) {
			var e = this,
			f = $(".image-mapper-svg", this);
			f.css("width", "100%"),
			$(".image-mapper-shape", f).remove(),
			$.each(c[b].area, function (g, h) {
				var i,
				j = [];
				$.each(h.coords, function ($, c) {
					var f = d.getClientPosition.apply(e, [b, c]);
					j.push(f.clientX, f.clientY)
				}),
				h.el && (i = h.el),
				"poly" == h.shape ? (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"))), i.attr("points", j.join(","))) : "circle" == h.shape ? j.length >= 4 && (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"))), i.attr("cx", j[0]).attr("cy", j[1]), i.attr("r", Math.sqrt(Math.pow(j[2] - j[0], 2) + Math.pow(j[3] - j[1], 2)))) : j.length >= 4 && (i || (i = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"))), i.attr("x", Math.min(j[0], j[2])).attr("y", Math.min(j[1], j[3])), i.attr("width", Math.abs(j[2] - j[0])).attr("height", Math.abs(j[3] - j[1]))),
				i && (i.attr("class", "image-mapper-shape"), i.attr("data-area-index", g), i.css(c[b].options.style), f.prepend(i), c[b].area[g].el = i)
			})
		},
		renderPoints : function (b) {
			var e = this,
			f = $(".image-mapper-svg", this);
			$(".image-mapper-point", f).remove();
			var g = c[b].state.areaIndex,
			h = c[b].area[g];
			$.each(h.coords, function (h, i) {
				var j = $(document.createElementNS("http://www.w3.org/2000/svg", "circle")),
				k = d.getClientPosition.apply(e, [b, i]);
				j.attr("cx", k.clientX).attr("cy", k.clientY),
				j.attr("r", 5),
				j.attr("class", "image-mapper-point"),
				j.attr("data-area-index", g),
				j.attr("data-coord-index", h),
				j.css(c[b].options.pointStyle),
				f.append(j)
			})
		},
		asHTML : function (b) {
			var d = $("<img />"),
			e = c[b].options.src;
			c[b].options.file.length > 0 && (e = c[b].options.file),
			d.attr("src", e),
			d.attr("usemap", "#image-map");
			var f = $("<map />");
			f.attr("name", "image-map");
			var g = [];
			$.each(c[b].area, function (d, e) {
				var f = [];
				if ($.each(e.coords, function ($, b) {
						f.push(b.naturalX, b.naturalY)
					}), "circle" == e.shape) {
					var h = Math.round(Math.sqrt(Math.pow(f[2] - f[0], 2) + Math.pow(f[3] - f[1], 2)));
					f = f.slice(0, 2),
					f.push(h)
				}
				var i = $("<area />");
				i.attr("target", c[b].area[d].target),
				i.attr("alt", c[b].area[d].title),
				i.attr("title", c[b].area[d].title),
				i.attr("href", c[b].area[d].href),
				i.attr("coords", f.join(",")),
				i.attr("shape", c[b].area[d].shape),
				g.push(i[0].outerHTML)
			}),
			f.append("\n    " + g.join("\n    ") + "\n");
			var h = "<!-- Image Map Generated -->";
			return h + "\n" + d[0].outerHTML + "\n\n" + f[0].outerHTML
		}
	};
	$.fn.imageMapper = function () {
		var b = "string" == typeof arguments[0] ? arguments[0] : "init",
		c = ("object" == typeof arguments[0] ? 0 : 1) || {},
		e = Array.prototype.slice.call(arguments, c),
		f = $(this).data("imageMapper");
		return "getData" == b ? d.getData(f) : "asHTML" == b ? d.asHTML(f) : (e.unshift(f), this.each(function () {
				"function" == typeof d[b] && d[b].apply(this, e)
			}))
	}
}
(jQuery)