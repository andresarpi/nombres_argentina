// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require jquery3
//= require jquery_ujs
//= require_tree .

$(document).on('turbolinks:load', function() {
    loadAvailableYears();
    $("#see-names-button").click(function() {
        seeNames();
    });
});

var loadAvailableYears = function() {
    $.ajax({
            url: "/available_years",
        })
        .done(function(data) {
            createOptionValuesFromArray(data, "year-chosen");
        })
        .fail(function() {
            destiny = document.getElementById("year-chosen");
            destiny.innerHTML = "<option>Parece que hubo un error</option>";
        });
}

var createOptionValuesFromArray = function(array, destiny) {
    destiny = document.getElementById(destiny);
    destiny.disabled = false;
    inner_html = "";
    for (i = 0; i < array.length; i++) {
        str = '<option value="' + array[i] + '">' + array[i] + '</option>';
        inner_html += str;
    }
    destiny.innerHTML = inner_html;
}

var seeNames = function() {
    year_selected = document.getElementById("year-chosen").value;
    if (!year_selected > 0) {
        alert("Elija un año valido");
        return;
    }

    if ($('#rest-names-checkbox').is(":checked")) {
        displayWithRest(year_selected);
    }
    else {
        displayWithoutRest(year_selected);
    }
}

var displayWithoutRest = function(year) {
    
    $("#year-chosen").val(year)
    
    $.ajax({
            url: "/names_by_year?year=" + year,
        })
        .done(function(data) {
            populateSvgWithoutRest(data, year);
        })
        .fail(function() {
            errorWithSvg();
        });
}

var displayWithRest = function(year) {

}

var populateSvgWithoutRest = function(data, year) {
    
    d3.select("svg").selectAll("*").remove();

    svg_width = $("#svg").width();
    svg_height = $("#svg").height();
    left_right_margin = svg_width * 0.02;
    efective_width = svg_width - 2 * left_right_margin;
    number_elements = data.length;
    interval = efective_width / number_elements;
    diminisher = 1000;
    ratio = interval * 0.95 / 3000;

    myRatio = 0.0245983280584297;


    var svg = d3.select("#svg");
    svg.selectAll("circle").remove();
    svg.selectAll("text").remove();

    circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle");

    circles.attr("cx", function(d, i) {
            pos = i * interval + 0.5 * interval + left_right_margin;
            return pos + "px";
        })
        .attr("cy", svg_height / 2)
        .attr("r", function(d) {
            r = (d.count - diminisher) * myRatio / 2;
            return r + "px";
        })
        .attr("class", "names-circle clickable-element")
        .on('click', function(d, i) {
            displayNameHistory(d.name);
        });

    var texts = svg.selectAll("text")
        .data(data)
        .enter();

    texts.append("text")
        .text(function(d) {
            return d.name;
        })
        .attr("x", function(d, i) {
            pos = i * interval + 0.5 * interval + left_right_margin;
            return pos + "px";
        })
        .attr("text-anchor", "middle")
        .attr("class", "circle-name svg-text")
        .attr("y", function(d) {
            r = (d.count - diminisher) * myRatio / 2;
            y = svg_height / 2 + 1.1 * r + 15
            return y + "px";
        });

    texts.append("text")
        .text(function(d) {
            return d.count;
        })
        .attr("x", function(d, i) {
            pos = i * interval + 0.5 * interval + left_right_margin;
            return pos + "px";
        })
        .attr("text-anchor", "middle")
        .attr("class", "circle-label svg-text")
        .attr("y", function(d) {
            r = (d.count - diminisher) * myRatio / 2;
            y = svg_height / 2 - 1.1 * r - 10
            return y + "px";
        });
        
    setTitle("Nombres más populares del " + year, 0.5);
}

var displayNameHistory = function(name) {
    $.ajax({
            url: "/name_through_years?name=" + name,
        })
        .done(function(data) {
            populateSvgWithNameHistory(data, name);
        })
        .fail(function() {
            errorWithSvg();
        });
}

var populateSvgWithNameHistory = function(data, name) {
    
    h = $("#svg").height();
    w = $("#svg").width();
    padding = 40;
    vertical_padding = 30;
    space_for_x_label = 20
    horizontal_padding = 60;
    
    var svg = d3.select("#svg");
    svg.selectAll("*").remove();

    maxYear = d3.max(data, function(d) {
        return d.year;
    });

    minYear = d3.min(data, function(d) {
        return d.year;
    });


    var xScale = d3.scaleTime()
        .domain([new Date(minYear - 1, 0, 1), new Date(maxYear + 1, 0, 1)])
        .range([0, w * 0.8]);

    var yScale = d3.scaleLinear().domain([0, 5000])
        .range([h - vertical_padding * 2 - space_for_x_label, 0]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            var xScale = d3.scaleTime()
                .domain([new Date(minYear - 1, 0, 1), new Date(maxYear + 1, 0, 1)])
                .range([0, w * 0.8]);

            return xScale(new Date(d.year, 0, 1));;
        })
        .attr("y", function(d, i) {
            var yScale = d3.scaleLinear().domain([0, 5000]).range([h - vertical_padding * 2 - space_for_x_label, 0]);
            return h - vertical_padding - space_for_x_label - yScale(5000 - d.count);
        })
        .attr("class", "clickable-element names-rectangle")
        .attr("width", 45)
        .on("click", function() {
            goToYearsFromNameRectangle(this);
        })
        .attr("height", function(d, i) {
            var yScale = d3.scaleLinear().domain([0, 5000]).range([h - vertical_padding * 2 - space_for_x_label, 0]);
            return yScale(5000 - d.count);
        });

    var texts = svg.selectAll("text")
        .data(data)
        .enter();

    texts.append("text")
        .text(function(d) {
            return d.year;
        })
        .attr("x", function(d, i) {
            var xScale = d3.scaleTime()
                .domain([new Date(minYear - 1, 0, 1), new Date(maxYear + 1, 0, 1)])
                .range([0, w * 0.8]);

            return 6 + xScale(new Date(d.year, 0, 1));
        })
        .attr("class", "year-axis-label svg-text")
        .attr("y", function(d) {
            return h - vertical_padding;
        });

    var xAxis = svg.append("line")
        .attr("x1", horizontal_padding)
        .attr("y1", h - vertical_padding - space_for_x_label)
        .attr("x2", w - 2 * horizontal_padding)
        .attr("y2", h - vertical_padding - space_for_x_label)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    var yAxis = d3.axisLeft(yScale).ticks(4);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + horizontal_padding + "," + vertical_padding + ")")
        .call(yAxis);
        
    setTitle(name + " a lo largo de los años", 0.7)

}

var goToYearsFromNameRectangle = function(element) {
    displayWithoutRest(element.__data__.year);
}

var setTitle = function (title, position) {
    var svg = d3.select("#svg");
    svg.append("text")
        .text(title)
        .attr("x", function(d, i) {
            svg_width = $("#svg").width();
            return svg_width * position;
        })
        .attr("id", "svg-title")
        .attr("class", "h2")
        .attr("text-anchor", "middle")
        .attr("y", function(d) {
            svg_height = $("#svg").height();
            return svg_height * 0.15;
        });
    
}

var errorWithSvg = function() {
    alert("Hubo un error. Intente de nuevo");
}
