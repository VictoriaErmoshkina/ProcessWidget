/**
 * Created by viktoria on 11.07.16.
 */
var width = 500;
var height = 500;

var processWidget = function (width, height, group, data) {
    var outCircleColor = "#5a8ec9";
    var innerCircleColor = "#1e376d";
    var darkStrokeColor = "#1C2E56";
    var view = group;
    var arc;
    var startAngle = 5 * Math.PI / 16;
    var arcLength = 3 * Math.PI / 8;
    var processWidgetData = data;
    var config = {
        nameHeight: calculateSize(0.2),
        outerradius: calculateSize(0.3),
        nameWidth: width*0.8,
        innerradius: calculateSize(0.18),
        fontSize: calculateSize(0.08),
        iconSize: calculateSize(0.3),
        animationStep: 800,
        iconlink: 'https://lh3.googleusercontent.com/-awJv5cT7ZrA/AAAAAAAAAAI/AAAAAAAAAAA/t2yC-_5oFM0/photo.jpg'
    };

    function highlightingGradient() {
        var radialGradient;
        radialGradient = view.append("defs")
            .append("radialGradient")
            .attr("id", "radial-gradient");
        radialGradient.append("stop")
            .attr("offset", "48%")
            .attr("stop-color", "#5fadff")
            .attr("stop-opacity", 1);
        radialGradient.append("stop")
            .attr("offset", "75%")
            .attr("stop-color", "#5a8ec9")
            .attr("stop-opacity", 0);
        return "url(#radial-gradient)";
    }

    function shadowGradient() {
        var radialGradient;
        radialGradient = view.append("defs")
            .append("radialGradient")
            .attr("id", "shadow-gradient");
        radialGradient.append("stop")
            .attr("offset", "30%")
            .attr("stop-color", "1e376d")
            .attr("stop-opacity", 0.5);
        radialGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#0f2452")
            .attr("stop-opacity", 0.8);
        return "url(#shadow-gradient)";
    }


    function drawOuterCircle() {
        var darkStrokeWidth = 4;
        var lightStrokeWidth = 2;

        var outerCircle = view.append("circle");
        outerCircle
            .attr("r", config.outerradius)
            .attr("fill-opacity", 0)
            .attr("fill", outCircleColor)
            //.transition().duration(config.animationStep)
            //.attr("fill-opacity", 0)
            //.attr("r", config.innerradius - darkStrokeWidth - lightStrokeWidth)
            .transition().delay(config.animationStep).duration(config.animationStep)
            //.attr("r", config.outerradius)
            .attr("fill", outCircleColor)
            .attr("fill-opacity", 0.2);
        var lightGradient = view.append("circle");
        lightGradient
            .attr("r", config.outerradius)
            .attr("fill-opacity", 0)
            .attr("fill", highlightingGradient())
            //.transition().duration(config.animationStep)
            //.attr("fill-opacity", 0)
            //.attr("r", config.innerradius - darkStrokeWidth - lightStrokeWidth)
            .transition().delay(config.animationStep).duration(config.animationStep)
            //.attr("r", config.outerradius)
            .attr("fill", highlightingGradient())
            .attr("fill-opacity", 0.4)
    }

    function drawInnerCircle() {
        var darkStrokeWidth = 4;
        var lightStrokeWidth = 2;
        var innerCircle = view.append("circle");
        innerCircle
            .attr("r", 0)
            .transition().duration(config.animationStep)
            .attr("r", config.innerradius - lightStrokeWidth)
            .attr("fill", innerCircleColor)
            .attr("fill-opacity", 0.9);
        var shadow = view.append("circle");
        shadow
            .attr("r", 0)
            .transition().duration(config.animationStep)
            .attr("r", config.innerradius )
            .attr("fill", shadowGradient())
            .attr("fill-opacity", 0.4);

    }

    function drawIcon() {
        view.append("image")
            .attr("xlink:href", config.iconlink)
            .attr("transform", "translate(" + (-config.iconSize * 0.5) + ", " + (-config.iconSize * 0.5) + ")")
            .attr("width", config.iconSize)
            .attr("height", config.iconSize)
            .attr("opacity", 0)
            .transition().delay(4*config.animationStep).duration(config.animationStep)
            .attr("opacity", 0.9);
    }

    function drawCircles() {
        drawOuterCircle();
        drawInnerCircle();

    }

    function statusTextColor(status) {
        switch (status) {
            case 'RED':
                return "#e997b8";
            case 'AMBER':
                return "#e9ae97";
            case 'GREEN':
                return "#89e3b3";
        }
    }

    function statusColor(status) {
        switch (status) {
            case 'RED':
                return "#a31a51";
            case 'AMBER':
                return "#c65919";
            case 'GREEN':
                return "#178e48";
        }
    }

    function drawStatusArc(startAngle, status) {
        arc.startAngle(startAngle);
        view.append("path")
            .style("fill", statusColor(status))
            .attr("d", arc.endAngle(startAngle + arcLength).outerRadius(config.innerradius))
            .attr("fill-opacity", 0.9)
            .transition().delay(2*config.animationStep).duration(config.animationStep)
            .attr("d", arc.endAngle(startAngle + arcLength).outerRadius(config.outerradius));
    }

    function statText(statusArc, text, status) {
        view.append("text")
            .classed("statusText", true)
            .attr("transform", "translate(" + arc.centroid(statusArc) + ")")
            .text(text)
            .attr("fill", statusTextColor(status))
            .attr("alignment-baseline", "middle")
            .attr("font-size", config.fontSize + "px")
            .attr("opacity", 0)
            .transition().delay(3*config.animationStep).duration(config.animationStep)
            .attr("opacity", 0.9);
    }

    function drawStatusArcs() {
        arc = d3.svg.arc()
            .innerRadius(config.innerradius)
            .outerRadius(config.outerradius)
            .startAngle(startAngle);
        var effStatus = drawStatusArc(startAngle, processWidgetData.efficiencyStatus);
        statText(effStatus, "E", processWidgetData.efficiencyStatus);
        startAngle = startAngle + Math.PI;
        var defStatus = drawStatusArc(startAngle, processWidgetData.definitionStatus);
        statText(defStatus, "D", processWidgetData.definitionStatus);
    }

    function nameText() {
        var textname = processWidgetData.name.toUpperCase();
        view.append("text")
            .classed("textName", true)
            .attr("transform", "translate(0," + (config.outerradius + config.nameHeight / 2) + ")")
            .text(textname)
            .attr("font-size", config.fontSize + "px")
            .call(wrap, config.nameWidth)
            .attr("opacity", 0)
            .transition().delay(4*config.animationStep).duration(config.animationStep)
            .attr("opacity", 0.9);
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

    function calculateSize(multiplier) {
        return Math.min(height, width) * multiplier;
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
        "definitionStatus": "AMBER",
        "efficiencyStatus": "RED"
    });
