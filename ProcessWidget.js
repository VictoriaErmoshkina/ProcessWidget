/**
 * Created by viktoria on 11.07.16.
 */

var processWidget = function (width, height, group) {
    var outCircleColor = "#2a457c";
    var innerCircleColor = "#1F3C76";
    var lightStrokeColor = "#36507D";
    var darkStrokeColor = "#1C2E56";
    var view = group;
    var arc;
    var startAngle = Math.PI / 4;
    var arcLength = Math.PI / 2;
    var nameHeight = 0.2 * height;
    var OUTER_RADIUS = (height ) / 2 - nameHeight;
    var nameWidth = width;
    var INNER_RADIUS = 0.64 * OUTER_RADIUS;
    var fontSize =   (nameHeight / 2);
    var processWidgetData = {
        "processID": "MP-16",
        "name": "Fin Reporting & Accounting",
        "definitionStatus": "AMBER",
        "efficiencyStatus": "RED"
    }

    function drawCircle(radius, color) {
        view.append("circle")
            .attr("r", radius)
            .attr("fill", color)
            .attr("fill-opacity", 0.9);
    }

    function drawCircles() {
        var darkStrokeWidth = 4;
        var lightStrokeWidth = 2;
        var outerCircle = drawCircle(OUTER_RADIUS, outCircleColor);
        var darkStroke = drawCircle(INNER_RADIUS, darkStrokeColor);
        //darkStroke.attr("fill-opacity", 0.8)
        var lightStroke = drawCircle(INNER_RADIUS - darkStrokeWidth, lightStrokeColor);
        var innerCircle = drawCircle(INNER_RADIUS - darkStrokeWidth - lightStrokeWidth, innerCircleColor);
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
            .attr("d", arc.endAngle(startAngle + arcLength))
            .attr("fill-opacity", 0.9);
    }

    function statText(statusArc, text) {
        view.append("text")
            .classed("statusText", true)
            .attr("transform", "translate(" + arc.centroid(statusArc) + ")")
            .text(text)
            .attr("font-size", fontSize + "px");
    }

    function drawStatusArcs() {
        arc = d3.svg.arc()
            .innerRadius(INNER_RADIUS)
            .outerRadius(OUTER_RADIUS)
            .startAngle(startAngle);
        var effStatus = drawStatusArc(startAngle, processWidgetData.efficiencyStatus);
        statText(effStatus, "F");
        startAngle = startAngle + 2 * arcLength;
        var defStatus = drawStatusArc(startAngle, processWidgetData.definitionStatus);
        statText(defStatus, "D");
    }

    function nameText() {
        view.append("text")
            .classed("textName", true)
            .attr("transform", "translate(0," + (OUTER_RADIUS+nameHeight/2) + ")")
            .text(processWidgetData.name)
            .call(wrap, nameWidth)
            .attr("font-size", fontSize + "px");
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


    function renderWidget() {
        drawCircles();
        drawStatusArcs();
        nameText();
    }

    renderWidget();

}(500, 500, d3.select(".center"));
