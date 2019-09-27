export function initMap(followers) {
  const d3 = window.d3;
  var myFollowers = followers;

  var width = window.innerWidth - 100,
    height = 500;

  //ADD SVG
  var svg = d3
    .select('#globalMap')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('map', true);

  //ADD TOOLTIP
  var tooltip = d3
    .select('#globalMap')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  //ADD PROJECTION - center and scale
  var projection = d3.geo
    .mercator()
    .center([0, 0]) //LON (left t0 right) + LAT (up and down)
    .scale(150) //DEFAULT Is 150
    .rotate([0, 0, 0]); //longitude, latitude and roll - if roll not specified - uses 0 - rotates the globe

  //PATH GENERATOR USING PROJECTION
  var path = d3.geo.path().projection(projection);

  //G AS APPENDED SVG
  var g = svg.append('g');

  getMap();

  function getMap() {
    // load and display the World
    d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@1.1.4/world/110m.json',
      function(json) {
        g.selectAll('path') //act on all path elements
          .data(window.topojson.feature(json, json.objects.countries).features) //get data
          .enter() //add to dom
          .append('path')
          .attr('fill', '#95E1D3')
          .attr('stroke', '#266D98')
          .attr('d', path);

        drawData();
      }
    );

    // zoom and pan
    var zoom = d3.behavior.zoom().on('zoom', function() {
      g.attr(
        'transform',
        'translate(' +
          d3.event.translate.join(',') +
          ')scale(' +
          d3.event.scale +
          ')'
      );
      g.selectAll('path').attr('d', path.projection(projection));
    });

    svg.call(zoom);
  }

  //ZOOM

  function drawData() {
    var data = myFollowers;

    var max = d3.max(data, function(d) {
      return d.followerNumber;
    });
    var min = d3.min(data, function(d) {
      return d.followerNumber;
    });

    var radiusScale = d3.scale
      .linear()
      .domain([min, max])
      .range([1, 5]);

    var circle = g
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.long, d.lat])[0];
      })
      .attr('cy', function(d) {
        return projection([d.long, d.lat])[1];
      })
      .attr('r', function(d) {
        return 3;
      })
      .style('fill', function(d) {
        return 'black';
      })
      .style('opacity', '0.5');

    circle.on('mouseover', function(d) {
      // if (!d.followerNumber) {
      //   d.followerNumber === "Unknown"
      // }

      d3.select(this)
        .style('fill', 'steelblue')
        .style('opacity', 1)
        .attr('r', function(d) {
          return 5;
        });

      var string =
        "<img class='profile-pic' style='width: 20px, height: 20px' src=" +
        d.profile +
        '/>';

      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.8);
      tooltip
        .html(
          'Name: ' +
            d.firstname +
            ' ' +
            d.lastname +
            '<br>Followers: ' +
            d.followerNumber +
            '<br>Country: ' +
            d.country +
            '<br>City: ' +
            d.city
        )
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    });

    circle.on('mouseout', function(d) {
      d3.select(this)
        .style('fill', 'black')
        .style('opacity', 0.5)
        .attr('r', function(d) {
          return 3;
        });

      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0);
    });
  }
}

function changeCoord(followers) {
  var followers = followers;

  var lats = [];
  var longs = [];

  followers.map(function(follower) {
    lats.push(follower.lat);
    longs.push(follower.long);
  });

  lats.sort(function(a, b) {
    return a - b;
  });

  longs.sort(function(a, b) {
    return a - b;
  });
  console.log(longs);

  var newLats = [];
  var newLongs = [];
  for (var i = 0; i < lats.length; i++) {
    if (lats[i] === lats[i - 1]) {
      newLats.push(lats[i]);
    }
  }

  for (var i = 0; i < longs.length; i++) {
    if (longs[i] === longs[i - 1]) {
      newLongs.push(longs[i]);
    }
  }

  console.log(newLats);
  console.log(newLongs);

  function random() {
    return Math.random() * 6 - 3;
  }

  followers.map(function(follower) {
    if (newLats.indexOf(follower.lat) > -1) {
      follower.lat += random();
    }
    if (newLongs.indexOf(follower.long) > -1) {
      follower.long += random();
    }
  });

  return followers;
}
