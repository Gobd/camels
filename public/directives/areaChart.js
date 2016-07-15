angular.module('app')
.directive('areaChart', function() {

  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  var height = 500 - margin.top - margin.bottom;
  var width = 960 - margin.left - margin.right;

  return {
    restrict: 'E',
    template: '<svg height='+500+' width='+960+'></div>',
    scope: {
      data: '='
    },
    controller: function($scope) {
      console.log($scope.data);
    },
    link: function(scope, elem, attr) {

      scope.data = scope.data.map(function(d) {
        d.date = new Date(d.date).getTime();
        return d;
      })

      var parseDate = d3.timeFormat("%d-%b-%y").parse;

      var x = d3.scaleLinear()
          .range([0, width])
          .domain(d3.extent(scope.data, function(d) { return d.date }))

      var y = d3.scaleLinear()
          .range([height, 0])
          .domain([
            0,
            d3.max(scope.data, function(d) { return d.price })
          ])

      var xAxis = d3.axisBottom()
          .scale(
            d3.scaleTime().range([0, width]).domain(
            d3.extent(scope.data, function(d) { return new Date(d.date)})
            )
          )

      var yAxis = d3.axisLeft()
          .scale(y)

      var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d.price)})

      var svg = d3.select(elem.find('svg')[0])
        .append('g')
          .attr('transform', 'translate('+ margin.left+','+margin.right+')')

      svg.append('path')
          .datum(scope.data)
          .attr('class', 'area')
          .attr('d', area);

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,'+height+')')
          .call(xAxis)

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
    }
  }
})
