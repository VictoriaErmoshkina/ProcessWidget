/**
 * Created by viktoria on 11.07.16.
 */
var name = "FIN REPORTING & ACCOUNTING";
var statusD = "AMBER";
var statusF = "GREEN";
var processWidget = function () {
    var outCircleColor = "#2a457c";
    var innerCircleColor = "#1F3C76";
    var lightStrokeColor = "#36507D";
    var darkStrokeColor = "#1C2E56";
    var view;
    var arc;
    var startAngle = Math.PI / 4;
    var arcLength = Math.PI / 2;
    var INNER_RADIUS = 45;
    var OUTER_RADIUS = 70;
    var nameHeight = 40;
    var height = 200 + nameHeight;
    var width = 200;

    function init() {
        view = d3.selectAll("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .classed("processWigdet", true)
            .attr("transform", "translate(" + width / 2 + "," + (height - nameHeight) / 2 + ")");

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

    function statText(astatusArc, text) {
        view.append("text")
            .classed("statusText", true)
            .attr("transform", "translate(" + arc.centroid(astatusArc) + ")")
            .text(text);
    }

    function drawStatusArcs() {
        arc = d3.svg.arc()
            .innerRadius(INNER_RADIUS)
            .outerRadius(OUTER_RADIUS)
            .startAngle(startAngle);
        var effStatus = drawStatusArc(startAngle, statusF);
        statText(effStatus, "F");
        startAngle = startAngle + 2 * arcLength;
        var defStatus = drawStatusArc(startAngle, statusD);
        statText(defStatus, "D");
    }

    function nameText(name) {
        view.append("text")
            .classed("textName", true)
            .attr("transform", "translate(0," + ((height - nameHeight) / 2 ) + ")")
            .attr("width", width)
            .attr("height", nameHeight)
            .text(name);
    }

    function renderWidget() {
        init();
        drawCircles();
        drawStatusArcs();
        nameText(name);
    }

    renderWidget();

}();
