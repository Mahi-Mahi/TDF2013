
//Special Marker

function MarkerLabel(opt_options) {
    
    this.setValues(opt_options);

    // Here go the label styles
    var span = this.span_ = document.createElement('span');
    span.style.cssText = 'position: relative; left: -50%; top: -50px; ' +
                         'padding: 2px; color: white;' +
                         'font-family: Arial; font-weight: bold; font-siez: 12px';

    var div = this.div_ = document.createElement('div');
    div.appendChild(span);
    div.style.cssText = 'position: absolute; display: none;';   
}
MarkerLabel.prototype = new google.maps.OverlayView;


MarkerLabel.prototype.onAdd = function() {
    
//    var pane = this.getPanes().overlayLayer;
//    pane.appendChild(this.div_);
    
    var pane = this.getPanes().overlayImage;
    pane.appendChild(this.div_);
    

    var me = this;
    this.listeners_ = [
        google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
        google.maps.event.addListener(this, 'text_changed', function() { me.draw(); }),
        google.maps.event.addListener(this, 'zindex_changed', function() { me.draw(); })
    ];
};

MarkerLabel.prototype.onRemove = function() {
    console.log("onRemove");
    this.div_.parentNode.removeChild(this.div_);

    for (var i = 0, I = this.listeners_.length; i < I; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

MarkerLabel.prototype.setText = function(text){
  this.span_.innerHTML = text;
};

MarkerLabel.prototype.draw = function() {

    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));

    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.display = 'block';
    div.style.zIndex = this.get('zIndex'); //ALLOW LABEL TO OVERLAY MARKER
    

    this.span_.innerHTML = this.get('text').toString();
};











