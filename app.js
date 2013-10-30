define ([

    // application components
    "jquery",
    "underscore"

], function ($, _) {

	return {

    events:{

      "click .controls a.scroll-rows": function(e){

        var $action = $(e.currentTarget),
            step = 360 / this.$rowsList.children().length,
            angle = parseInt(this.$rowsList.attr('data-angle') || 0),
            $current = this.$rowsList.children('.current').removeClass('current'),
            fwd = $action.hasClass('up'),
            $next;

        angle += fwd ? -step : step;
        $next = $current [fwd ? 'next' : 'prev'] ();

        ( $next.length ? $next : this.$rowsList.children() [fwd ? 'first' : 'last'] ()  ).addClass('current');

        this.$rowsList.css({
          "-webkit-transform": "rotateX(" + angle +"deg)"
        }).attr('data-angle', angle);

        return false;

      },

      "click .controls a.scroll-items": function(e){
        var $currentRow = this.$rowsList.children('.current'),
            $itemsList = $currentRow.children();

        var $action = $(e.currentTarget),
            step = 360 / $itemsList.children().length,
            angle = parseInt($itemsList.attr('data-angle') || 0),
            $current = $itemsList.children('.current').removeClass('current'),
            fwd = $action.hasClass('right'),
            $next;

        angle += fwd ? -step : step;
        $next = $current [fwd ? 'next' : 'prev'] ();

        ( $next.length ? $next : $itemsList.children() [fwd ? 'first' : 'last'] ()  ).addClass('current');

        $itemsList.css({
          "-webkit-transform": "rotateY(" + angle +"deg)"
        }).attr('data-angle', angle);

        return false;

      },

      "click .controls a.zoom": function(e){
        $(e.currentTarget).toggleClass('in');
        this.$viewport.toggleClass('scaled');

        return false;

      },

      "change .controls .toggle-rotate input": function(e){
        this.$viewport.toggleClass('rotated');
        return false;
      },

      "submit form": function(e){
        var $form = $(event.target),
            tag = $form.find('input').val();

        if (tag){
          this.fetch(tag, this.render);  
        }
        
        return false;
      }
    },

    bindEvents: function($target){
      var evtName, selector, callback;

      for (var title in this.events){
        evtName = title.slice(0, title.indexOf(' '));
        selector = title.slice(title.indexOf(' '));
        callback = this.events [title];

        $target.on(evtName, selector, _.bind(callback, this));
      }
    },

    flickerAPI : "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",

    createRow: function(){
      return $(
        "<li class='row'><ul class='items-list'></ul></li>"
      );
    },

    createItem: function(item){
      return $(
        "<li class='item'>" + 
          "<img src='" + item.media.m.replace('m.jpg', 'b.jpg') + "'/>" + 
        "</li>"
      );
    },  

    populate: function($target, items, i){
      if (items.length && i) {
        var $item = this.createItem(items [Math.round(Math.random()*19)]);
        $target.append($item);

        if ($item.is(':first-child')) { $item.addClass('current'); }

        var $img = $item.find('img');

        this.populate($target, items, i - 1);

        // next image after previous
        // $img.bind('load', _.bind(function(){
        //  this.populate($target, items, i - 1);
        //}, this));
      }
    },

    fetch: function(tagname, callback){
      $.getJSON( this.flickerAPI, {
        tags: tagname,
        tagmode: "any",
        format: "json"
      })
        .done(_.bind(callback, this));
    },

    render: function(data){

      // cleanup
      this.$rowsList.empty().removeAttr('style');

      console.log('rendering data:', data);

      // populate with rows and items
      for (var i=0;i<this.rowsCount;i++){
        var $row = this.createRow();
        if (!i) { $row.addClass('current'); }

        this.$content.find('>.rows-list').append($row);

        this.populate($row.find('.items-list'), data.items, this.itemsCount);        
      }

      // set transform-origin for rows and items holders

      var rowsAngle = 360 / this.rowsCount * Math.PI /180 / 2,
          itemsAngle = 360 / this.itemsCount * Math.PI /180 / 2;

      this.$rowsList.css({
        "-webkit-transform-origin": "0 " + (this.$rowsList.height() / 2) + "px " + (this.$rowsList.height() * (-1 / Math.tan(rowsAngle) / 2)).toFixed(6) + "px"
      });

      this.$content.find('.items-list').each(function(){
        var $this = $(this),
            width = $this.children().first().width();

        $this.css({
          "-webkit-transform-origin": (width / 2) + "px 0 " +  (width * (-1 / Math.tan(itemsAngle) / 2)).toFixed(6) + "px"
        });   
      });
    },

    start: function (options) {
      var options = options || {};

      this.rowsCount = options.rowsCount || 5;
      this.itemsCount = options.itemsCount || 6;

      // set key nodes
      this.$main = $('body > .main');
      this.$viewport = $('#viewport');
      this.$content = $('#content');
      this.$rowsList = this.$content.find('.rows-list');

      // fetch initial image list
      this.fetch('sunset', this.render);

      // bind controls
      this.bindEvents(this.$main);

      console.log('Application started');
    }
  };

}); 