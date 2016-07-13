/**
 * Created by viktoria on 11.07.16.
 */
var width = 200;
var height = 200;

var processWidget = function (width, height, group, data) {
    var outCircleColor = "#2a457c";
    var innerCircleColor = "#1f3871";
    var darkStrokeColor = "#1C2E56";
    var view = group;
    var arc;
    var startAngle = 5 * Math.PI / 16;
    var arcLength = 3 * Math.PI / 8;
    var nameHeight = 0.2 * height;
    var OUTER_RADIUS = height / 2 - nameHeight;
    var nameWidth = width;
    var INNER_RADIUS = 0.6 * OUTER_RADIUS;
    var fontSize = 0.8 * (nameHeight / 2);
    var iconCoef = 0.3;
    var iconlink = "icon-cat.jpg";
    var processWidgetData = data;
    var config = {
           //TODO place all properties into config
    };
    function highlightingGradient() {
        var radialGradient;
        radialGradient = view.append("defs")
            .append("radialGradient")
            .attr("id", "radial-gradient");
        radialGradient.append("stop")
            .attr("offset", "63%")
            .attr("stop-color", "#345c99") //345c99
            .attr("stop-opacity", 1);
        radialGradient.append("stop")
            .attr("offset", "90%")
            .attr("stop-color", "#2c4b84") //2c4b84
            .attr("stop-opacity", 0.6);
        return "url(#radial-gradient)";
    }

    function shadowGradient() {
        var radialGradient;
        radialGradient = view.append("defs")
            .append("radialGradient")
            .attr("id", "shadow-gradient");
        radialGradient.append("stop")
            .attr("offset", "60%")
            .attr("stop-color", "black") //345c99
            .attr("stop-opacity", 1);
        radialGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#2c4b84") //2c4b84
            .attr("stop-opacity", 0);
        return "url(#shadow-gradient)";
    }

    function drawCircle(radius, color) {
        view.append("circle")
            .attr("r", radius)
            .attr("fill", color)
            .attr("fill-opacity", 0.9);
    }

    function drawOuterCircle(){
        var darkStrokeWidth = 4;
        var lightStrokeWidth = 2;

        var outerCircle = view.append("circle");// = drawCircle(OUTER_RADIUS, outCircleColor);
        outerCircle
            .attr("r", 0)
            .transition().duration(1000)
            .attr("r", INNER_RADIUS - darkStrokeWidth - lightStrokeWidth)
            .attr("fill", outCircleColor)
            .attr("fill-opacity", 0.9);
        //var lightGradient = view.append("circle"); // = drawCircle(OUTER_RADIUS, highlightingGradient());

    }
    function drawInnerCircle(){
        var darkStrokeWidth = 4;
        var lightStrokeWidth = 2;
        //var shadow = drawCircle(INNER_RADIUS + darkStrokeWidth + lightStrokeWidth, shadowGradient());
        //var stroke = drawCircle(INNER_RADIUS - darkStrokeWidth, darkStrokeColor);
        //var innerCircle = drawCircle(INNER_RADIUS - darkStrokeWidth - lightStrokeWidth, innerCircleColor);
        var shadow =  view.append("circle");
        shadow
            .attr("r", 0)
            .transition().duration(1000)
            .attr("r", INNER_RADIUS + darkStrokeWidth + lightStrokeWidth)
            .attr("fill", shadowGradient())
            .attr("fill-opacity", 0.9);
        var innerCircle = view.append("circle");
        innerCircle
            .attr("r", 0)
            .transition().duration(1000)
            .attr("r", INNER_RADIUS - darkStrokeWidth - lightStrokeWidth)
            .attr("fill", innerCircleColor)
            .attr("fill-opacity", 0.9);

    }

    function drawIcon() {
        var size = 50;
        view.append("image")
            .attr("xlink:href", iconlink)
            .attr("transform", "translate(" + (-size*0.5) + ", " + (-size*0.5) + ")")
            .attr("width", size)
            .attr("height", size);
    }

    function drawCircles() {
        drawOuterCircle();
        drawInnerCircle();

    }

    function statusColor(status) {
        switch (status) {
            case 'RED':
                return "#a8184d";
            case 'AMBER':
                return "#cd5f22";
            case 'GREEN':
                return "#1b8958";
        }
    }

    function drawStatusArc(startAngle, status) {
        arc.startAngle(startAngle);
        view.append("path")
            .style("fill", statusColor(status))
            .attr("d", arc.endAngle(startAngle + arcLength).outerRadius(INNER_RADIUS))
            .attr("fill-opacity", 0.9).transition().duration(1000).attr("d", arc.endAngle(startAngle + arcLength).outerRadius(OUTER_RADIUS));
    }

    function statText(statusArc, text) {
        view.append("text")
            .classed("statusText", true)
            .attr("transform", "translate(" + arc.centroid(statusArc) + ")")
            .text(text)
            .attr("alignment-baseline", "middle")
            .attr("font-size", fontSize + "px");
    }

    function drawStatusArcs() {
        arc = d3.svg.arc()
            .innerRadius(INNER_RADIUS)
            .outerRadius(OUTER_RADIUS)
            .startAngle(startAngle);
        var effStatus = drawStatusArc(startAngle, processWidgetData.efficiencyStatus);
        statText(effStatus, "E");
        startAngle = startAngle + Math.PI;
        var defStatus = drawStatusArc(startAngle, processWidgetData.definitionStatus);
        statText(defStatus, "D");
    }

    function nameText() {
        view.append("text")
            .classed("textName", true)
            .attr("transform", "translate(0," + (OUTER_RADIUS + nameHeight / 2) + ")")
            .text(processWidgetData.name)
            .attr("font-size", fontSize + "px")
            .call(wrap, nameWidth);
    }

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1,
                y = text.attr("y"),
                dy = text.attr("dy") ? text.attr("dy") : 0,
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }

    function calculateSize(multiplier){
        return height*multiplier;
    }
    function renderWidget() {
        drawCircles();
        drawStatusArcs();
        drawIcon();
        nameText();
    }

    renderWidget();

}(width, height, d3.select(".center"),
    {
        "processID": "MP-16",
        "name": "Fin Reporting & Accounting",
        "definitionStatus": "RED",
        "efficiencyStatus": "GREEN"
    });
