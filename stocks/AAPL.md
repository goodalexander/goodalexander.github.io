---
layout: page
title: AAPL
permalink: /equity/AAPL
tags: stocks
---

Below are relevant factors for AAPL

Next I want to look at a chart

<p></p>

<font color="blue"> Performance of Dogs </font> <font color="red"> vs Cats </font>

<html>
  <head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
			google.charts.load('current', {packages: ['corechart', 'line']});
	    google.charts.setOnLoadCallback(drawCurveTypes);

	   function drawCurveTypes() {
	      var data = new google.visualization.DataTable();
	      data.addColumn('date', 'X');
	      data.addColumn('number', 'Dogs');
	      data.addColumn('number', 'Cats');

	      data.addRows([
	        [new Date(2000, 8, 5), 0, 0],
					[new Date(2000, 8, 6), 10, 5],
					[new Date(2000, 8, 7), 23, 15],
					[new Date(2000, 8, 8), 17, 9],
					[new Date(2000, 8, 9), 18, 9],
					[new Date(2000, 8, 10), 21, 12],
					[new Date(2000, 8, 11), 23, 13],
					[new Date(2000, 8, 12), 15, 15],
					[new Date(2000, 8, 13), 16, 21],
					[new Date(2000, 8, 14), 25, 15],
					[new Date(2000, 8, 15), 42, 15],
					[new Date(2000, 8, 16), 24, 13],
					[new Date(2000, 8, 17), 42, 12],
					[new Date(2000, 8, 18), 42, 11],
					[new Date(2000, 8, 19), 44, 10],
					[new Date(2000, 8, 20), 45, 9]

	      ]);

	      var options = {
	        hAxis: {
	          title: 'Time'
	        },
	        vAxis: {
	          title: 'Popularity'
	        },
	        series: {
	          1: {curveType: 'function'}
	        }
	      };

	      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	      chart.draw(data, options);
	    }
    </script>
  </head>
  <body>
    <div id="chart_div"></div>
  </body>
</html>

Now let's look at a table in context of said chart


<html>
  <head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['table']});
      google.charts.setOnLoadCallback(drawTable);

      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Weight');
        data.addColumn('boolean', 'Current Position');
        data.addRows([
          ['Stocks',  {v: 10000, f: '-30%'}, true],
          ['Bonds',   {v:8000,   f: '+5%'},  false],
          ['Gold', {v: 12500, f: '10%'}, true],
          ['Bitcoin',   {v: 7000,  f: '-2%'},  true]
        ]);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
      }
    </script>
  </head>
  <body>
    <div id="table_div"></div>
  </body>
</html>

Finally I want to see if I can actually query a google spreadsheet as This
would enable rapid updating of all of this which would be a bit epic