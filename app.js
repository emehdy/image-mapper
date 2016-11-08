	$(function () {
		function array2base64($) {
			for (var base = "", c = new Uint8Array($), d = c.byteLength, e = 0; d > e; e++)
				base += String.fromCharCode(c[e]);
			return window.btoa(base)
		};
		var imageMapperRow = $("#image-mapper-table tbody").html();
		$(document).on("click", "button.add-row", function (evt) {
			$("#image-map").imageMapper("addArea").trigger("update"),
			evt.preventDefault()
		});
		$(document).on("update", "#image-map", function () {
			var data = $(this).imageMapper("getData"),
			table = $("#image-mapper-table"),
			row = imageMapperRow;
			$("tbody", table).html(""),
			$.each(data.area, function (i) {
				row = row.replace(/im\[[\d]+\]/gi, "im[" + i + "]"),
				$("tbody", table).append(row)
			}),
			$(this).imageMapper("bindValues")
		});
		$(document).on("update", "#image-map", function () {
			var data = $(this).imageMapper("getData");
			0 == data.options.src.length ? $(".toggle-content").hide() : $(".toggle-content").show()
		});
		$("#image-map").imageMapper({
			src : "",
			event : {
				init : function () {
					$("#image-map").trigger("update")
				},
				update : function () {
					$("#image-map").trigger("update")
				},
				removeArea : function () {
					$("#image-map").trigger("update")
				}
			}
		});
		$(document).on("show.bs.modal", "#modal-code", function () {
			var html = $("#image-map").imageMapper("asHTML");
			$("#modal-code-result").text(html).css("whiteSpace", "pre")
		});
		$(document).on("click", "#image-mapper-button", function () {
			var html = $("#image-map").imageMapper("asHTML");
			$("#image-mapper-output").text(html).css("whiteSpace", "pre")
		});
		$(document).on("click", "#image-mapper-upload", function () {
			$("#image-mapper-file").trigger("click")
		});
		var promise = {
			success : function () {
				var dialog = $("#image-mapper-dialog");
				$("#image-mapper-continue", dialog).attr("disabled", !1),
				$(".input-group", dialog).addClass("has-success").removeClass("has-error").removeClass("has-warning"),
				$(".input-group-addon > span", dialog).attr("class", "glyphicon glyphicon-ok")
			},
			error : function () {
				var dialog = $("#image-mapper-dialog");
				$("#image-mapper-continue", dialog).attr("disabled", "disabled"),
				$(".input-group", dialog).addClass("has-error").removeClass("has-success").removeClass("has-warning"),
				$(".input-group-addon > span", dialog).attr("class", "glyphicon glyphicon-remove")
			}
		};
		$(document).on("keydown keyup", "#image-mapper-url", function () {
			var check = $(this).val().match(/(((([A-Za-z]{3,9}):(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/),
			d = ["http", "https"];
			null != check && -1 != d.indexOf(check[4]) ? promise.success() : promise.error()
		});
		$(document).on("show.bs.modal", "#image-mapper-load", function () {
			var dialog = $("#image-mapper-dialog");
			$("#image-mapper-url", dialog).val(""),
			promise.error()
		});
		$(document).on("click", "#image-mapper-continue", function () {
			var dialog = $("#image-mapper-dialog");
			$("#image-map").imageMapper("update", {
				src : $("#image-mapper-url", dialog).val(),
				file : ""
			}),
			$("#image-mapper-load").modal("hide")
		});
		$(document).on("change", "#image-mapper-file", function () {
			var file = this.files[0],
			reader = new FileReader;
			reader.onloadend = function (entry) {
				var e = array2base64(entry.target.result);
				$("#image-map").imageMapper("update", {
					src : "data:" + file.type + ";base64," + e,
					file : file.name
				})
			},
			file ? reader.readAsArrayBuffer(file) : $("#image-map").imageMapper("update", {
				src : "",
				file : ""
			})
		});
		
	})
