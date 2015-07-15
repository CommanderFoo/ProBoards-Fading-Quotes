$(function(){

	({

		settings: {
		
			quote_height: 150,
			start_colour: "ffffff",
			end_colour: "ffffff",
			expand_text: "Expand",
			expand_colour: "0c00ff"
		
		},
		
		use_boards: [],
		
		init: function(){
			if(typeof yootil == "undefined"){
				return;
			}
			
			this.setup();
			
			if(!this.can_use_in_board()){
				return;	
			}
			
			var location_check = (yootil.location.check.search_results() || yootil.location.check.message_thread() || yootil.location.check.thread() || yootil.location.check.recent_posts() || $("div.container.posts.summary").length);

			if(location_check){
				this.fade_quotes();
				yootil.ajax.after_search(this.fade_quotes, this);
			}
		},
		
		setup: function(){
			var plugin = proboards.plugin.get("pd_fading_quotes");
			var settings = (plugin && plugin.settings)? plugin.settings : false;

			if(settings){
				this.use_boards = settings.use_boards || [];
				this.settings.quote_height = (parseFloat(settings.quote_height) > 0)? parseFloat(settings.quote_height) : this.settings.quote_height;
				this.settings.start_colour = (settings.gradient_start_colour.length)? settings.gradient_start_colour : this.settings.start_colour;
				this.settings.end_colour = (settings.gradient_end_colour.length)? settings.gradient_end_colour : this.settings.end_colour;
				this.settings.expand_colour = (settings.expand_text_colour.length)? settings.expand_text_colour : this.settings.expand_colour;
				this.settings.expand_text = (settings.expand_text.length)? settings.expand_text : this.settings.expand_text;
				
				this.settings.start_colour = proboards.shared.hexToRgb(this.settings.start_colour);
				this.settings.end_colour = proboards.shared.hexToRgb(this.settings.end_colour);
			} 
		},
		
		can_use_in_board: function(){
			if(this.use_boards.length){
				var board_id = parseInt(yootil.page.board.id());
	
				if(board_id && $.inArrayLoose(board_id, this.use_boards) == -1){
					return false;
				}
			}
	
			return true;				
		},
		
		fade_quotes: function(){
			var self = this;
			var quotes = $("tr.item td.content div.message > div.quote");
			var gradient = "linear-gradient(to bottom, rgba(";
			var offset = (yootil.location.check.message_thread())? 0 : 5;
			
			gradient += this.settings.start_colour[0] + ", " + this.settings.start_colour[1] + ", " + this.settings.start_colour[2] + ", 0.00) 0%, ";
			gradient += "rgba(" + this.settings.end_colour[0] + ", " + this.settings.end_colour[1] + ", " + this.settings.end_colour[2] + ", 1.00) 80%)";
			
			$.each(quotes, function(){
				var quote = $(this);
				
				if(quote.height() <= self.settings.quote_height){
					return;
				}

				quote.append("<div style='display: none' class='fading_quote'><span style='color: #" + self.settings.expand_colour + "'>" + self.settings.expand_text + "</span></div>").find("div.quote_body:first").css({
				
					overflow: "hidden",
					"max-height": self.settings.quote_height
				
				});
				
				quote.find("div.fading_quote").css({
				
					top: (quote.height() - (70 + offset)) + "px",
					background: gradient	
					
				}).show().find("span").click(function(){
					$(this).parent().parent().find("div.quote_body:first").css("max-height", "none").css("overflow", "visible");
					$(this).parent().remove();
				});
			});
		}
	
	}).init();

});