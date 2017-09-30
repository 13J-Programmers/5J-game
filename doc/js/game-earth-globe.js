'use strict';

class EarthGlobe {
  constructor(htmlSelector) {
    this.countries = [];  // Country data (coordinate, polygon)

    var width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    var height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    // Add stage to display world map
    this.stage = d3.select(htmlSelector)
      .append("svg:svg")
      .attr({
        "width":  width,
        "height": height,
        "opacity": 0.3,
      });

    this.projection_scale = 550;
    this.projection_rotate = [220, 0, 0];
    this.projection_position = [width/2, height*3/5];

    // Configure projection
    this.projection = d3.geo.orthographic()
      .scale(this.projection_scale)
      .translate(this.projection_position)
      .rotate(this.projection_rotate)
      .clipAngle(90); // Display angle
    this.projection_back = d3.geo.orthographic()
      .scale(this.projection_scale)
      .translate(this.projection_position)
      .rotate(this.projection_rotate)
      .clipAngle(180); // Display angle

    // Create path generator
    this.path = d3.geo.path().projection(this.projection);
    this.path_back = d3.geo.path().projection(this.projection_back);

    this.country_color = d3.scale.linear()
      .domain([0, 1, 2])
      .range(['green', 'red', 'black']);

    // Read map data
    d3.json("data/countries.topojson", (json) => {

      // Convert topojson -> geojson
      this.countries = topojson.feature(json, json.objects.countries).features;
      for (var i = 0; i < this.countries.length; i++) {
        this.countries[i].disaster = 0;
      }

      this.plot_countries();
      this.update_rotation();
    });
  }

  plot_countries() {
    this.world_map_back = this.stage.selectAll("path.back_country")
      .data(this.countries)
    this.world_map_back.exit().remove()
    this.world_map_back.enter()
      .append("svg:path")
      .attr({
        "class": "back_country",
        "d": this.path,
        "opacity": 0.3,
        "fill-opacity": 1,
        "fill": (d) => this.country_color(d.disaster),
        "data-tip": (d) => d.properties.sovereignt,
      })
    this.world_map_back.transition()
      .duration(500)
      .attr('fill', (d) => this.country_color(d.disaster))

    this.world_map = this.stage.selectAll("path.country")
      .data(this.countries)
    this.world_map.exit().remove()
    this.world_map.enter()
      .append("svg:path")
      .attr({
        "class": "country",
        "d": this.path,
        "fill-opacity": 1,
        "fill": (d) => this.country_color(d.disaster),
        "data-tip": (d) => d.properties.sovereignt,
      })
    this.world_map.transition()
      .duration(500)
      .attr('fill', (d) => this.country_color(d.disaster))
  }

  // Rotate projection
  update_rotation() {
    this.projection_rotate[0] += 0.05; // x_axis
    this.projection_back.rotate(this.projection_rotate);
    this.projection.rotate(this.projection_rotate);
    // update path function
    this.path_back = d3.geo.path().projection(this.projection_back);
    this.path      = d3.geo.path().projection(this.projection);
    // apply path function to map object
    this.world_map_back.attr("d", this.path_back);
    this.world_map.attr("d", this.path);
  }

  loop() {
    setInterval(() => {
      this.plot_countries();
      this.update_rotation();
    }, 200);
  }

  setDisasterRandom() {
    for (var i = 0; i < this.countries.length; i++) {
      this.countries[i].disaster = Math.random();
    }
  }

  setDisasterZero() {
    for (var i = 0; i < this.countries.length; i++) {
      this.countries[i].disaster = 0;
    }
  }

  setDisasterPhase(level) {
    if (level === 0) {
      this.setDisasterZero();
    }
    else if (level === 1) {
      for (var i = 0; i < this.infectedCountryIndex1.length; i++) {
        this.countries[this.infectedCountryIndex1[i]].disaster = 0.5 + Math.random() * 0.5;
      }
    }
    else if (level === 2) {
      for (var i = 0; i < this.infectedCountryIndex2.length; i++) {
        this.countries[this.infectedCountryIndex2[i]].disaster = 0.5 + Math.random() * 0.5;
      }
    }
    else if (level === 3) {
      for (var i = 0; i < this.infectedCountryIndex3.length; i++) {
        this.countries[this.infectedCountryIndex3[i]].disaster = 0.5 + Math.random() * 0.5;
      }
    }
    else if (level === 4) {
      for (var i = 0; i < this.infectedCountryIndex4.length; i++) {
        this.countries[this.infectedCountryIndex4[i]].disaster = 0.5 + Math.random() * 0.5;
      }
    }
    else if (level === 5) {
      for (var i = 0; i < this.countries.length; i++) {
        this.countries[i].disaster *= 2;
      }
      for (var i = 0; i < this.infectedCountryIndex5.length; i++) {
        this.countries[this.infectedCountryIndex5[i]].disaster = 0.5 + Math.random() * 0.5;
      }
    }
    else if (level === 6) {
      for (var i = 0; i < this.countries.length; i++) {
        this.countries[i].disaster = 2.0;
      }
    }
    else {
      this.setDisasterZero();
    }
  }

  setDisasterPhaseConfig() {
    var indices = [];
    for (var i = 0; i < this.countries.length; i++) {
      indices.push(i);
    }
    var shuffleIndices = Utils.shuffle(indices);
    this.infectedCountryIndex1 = shuffleIndices.slice(0, 10);
    this.infectedCountryIndex2 = shuffleIndices.slice(10, 30);
    this.infectedCountryIndex3 = shuffleIndices.slice(30, 70);
    this.infectedCountryIndex4 = shuffleIndices.slice(70, 150);
    this.infectedCountryIndex5 = shuffleIndices.slice(150);
  }
}
