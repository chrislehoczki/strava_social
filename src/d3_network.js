export function createDataPoints(user) {
  var newLinks = [];
  var followers = user.strava.followers;

  //CREATE FIRST OBJ
  var followerObj = {};
  followerObj.source = user.strava.id;
  followerObj.target = user.strava.id;
  followerObj.name = user.strava.details.firstname;
  followerObj.lastname = user.strava.details.lastname;
  followerObj.img = user.strava.details.profile;
  followerObj.class = 'user';
  followerObj.country = user.strava.details.country;
  followerObj.followerNumber = user.strava.followers.length;
  newLinks.push(followerObj);

  followers.forEach(function(follower) {
    var followerObj = {};
    followerObj.source = user.strava.id;
    followerObj.target = follower.id;
    followerObj.name = follower.firstname;
    followerObj.lastname = follower.lastname;
    followerObj.img = follower.profile;
    followerObj.followerNumber = follower.followerNumber;
    followerObj.country = follower.country;
    newLinks.push(followerObj);

    if (follower.followers) {
      var counter = 0;
      var finished = false;

      follower.followers.forEach(function(follower2) {
        //IF FOLLOWER IS ONE OF MY FOLLOWERS
        if (user.strava.followerIds.indexOf(follower2) > -1) {
          if (!finished) {
            var follower2Obj = {};
            follower2Obj.source = follower.id;
            follower2Obj.target = follower2;
            follower2Obj.followerNumber = getValue(follower2, 'followerNumber');
            follower2Obj.name = getValue(follower2, 'firstname');
            follower2Obj.lastname = getValue(follower2, 'lastname');
            follower2Obj.img = getValue(follower2, 'profile');
            follower2Obj.country = getValue(follower2, 'country');
            newLinks.push(follower2Obj);
            counter += 1;
          }

          if (counter === 5) {
            finished = true;
          }
        }
      });
    }
  });

  function getValue(id, value) {
    var returnValue;
    followers.forEach(function(follower) {
      if (follower.id === id) {
        returnValue = follower[value];
      }
    });
    return returnValue;
  }

  return newLinks;
  // return links;
  // createGraph(links)
}

export function createGraph(links) {
  const d3 = window.d3;
  var nodes = {};

  links.forEach(function(link) {
    //USER NODE
    link.source = nodes[link.source] || (nodes[link.source] = link);
    //FOLLOWER NODES
    link.target = nodes[link.target] || (nodes[link.target] = link);
  });

  var padding = window.innerWidth / 20;

  var width = window.innerWidth - 100,
    height = 900;

  d3.select('svg').remove();
  var svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  var tooltip = d3
    .select('#graph')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  var force = d3.layout
    .force()
    .nodes(d3.values(nodes)) //CREATES AN ARRAY FROM OUR OBJECT
    .links(links)
    .size([width, height])
    .gravity(0.22)
    .linkDistance(70)
    .charge(function(d) {
      return -(d.weight * 70 + 500);
    })
    .on('tick', tick) //RUNS LAYOUT ONE STEP
    .start(); //STARTS SIMULATION - NEEDS TO BE RUN WHEN LAYOUT FIRST CREATED

  var link = svg
    .selectAll('.link')
    .data(force.links())
    .enter()
    .append('line')
    .attr('class', 'link');

  var drag = force.drag().on('dragstart', dragstart);

  function dblclick(d) {
    d3.select(this).classed('fixed', (d.fixed = false));
  }

  function dragstart(d) {
    d3.select(this).classed('fixed', (d.fixed = true));
  }

  var node = svg
    .selectAll('.node')
    .data(force.nodes())
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .call(drag); //MAKES IT DRAGGABLE

  node
    .append('circle')
    .attr('r', function(d) {
      var value = d.class === 'user' ? 25 : d.weight / 5 + 14;
      return value;
    })
    .style('fill', function(d) {
      var value = d.class === 'user' ? 'steelblue' : 'black';
      return value;
    })
    .classed('circle', true);

  //FOR USERS
  node
    .append('image')
    .attr('xlink:href', function(d) {
      return d.img;
    })
    .attr('class', 'profile-pic')
    .attr('height', function(d) {
      var value = d.class === 'user' ? 30 : 20;
      return value;
    })
    .attr('width', function(d) {
      var value = d.class === 'user' ? 30 : 20;
      return value;
    })

    .attr('x', function(d) {
      var value = d.class === 'user' ? -15 : -10;
      return value;
    })
    .attr('y', function(d) {
      var value = d.class === 'user' ? -15 : -10;
      return value;
      return -10;
    });

  function tick() {
    link
      .attr('x1', function(d) {
        return d.source.x;
      })
      .attr('y1', function(d) {
        return d.source.y;
      })
      .attr('x2', function(d) {
        return d.target.x;
      })
      .attr('y2', function(d) {
        return d.target.y;
      });

    node
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .attr('fill', 'black');
  }

  function mouseover(d) {
    if (!d.followerNumber) {
      d.followerNumber = 'Unknown';
    }

    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.7);
    tooltip
      .html(
        'Name: ' +
          d.name +
          ' ' +
          d.lastname +
          '<br>Country: ' +
          d.country +
          '<br>Followers: ' +
          d.followerNumber
      )
      .style('left', d3.event.pageX + 10 + 'px')
      .style('top', d3.event.pageY - 28 + 'px');
  }

  function mouseout(d) {
    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0);
  }
}
