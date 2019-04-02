function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var metadata_url = "/metadata/" + sample;
    console.log(metadata_url);
    // Use d3 to select the panel with id of `#sample-metadata`
    
    d3.json(metadata_url).then(function(sample) {
      console.log(sample);

      var metadata = d3.select("#sample-metadata");
      
    // Use `.html("") to clear any existing metadata
      sample-metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(([key,value])=> {
        console.log(`${key}${value}`);
        metadata.append("div").text(`${key}: ${value}`);
      });
    });
  }
    //BONUS: Build the Gauge Chart
    // Referenced from https://plot.ly/javascript/gauge-charts/
    // var level = sample.WFREQ *20;

    // // Trig to calc meter point
    // var degrees = 180 - level,
    //      radius = .5;
    // var radians = degrees * Math.PI / 180;
    // var x = radius * Math.cos(radians);
    // var y = radius * Math.sin(radians);
    
    // // Path: may have to change to create a better triangle
    // var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    //      pathX = String(x),
    //      space = ' ',
    //      pathY = String(y),
    //      pathEnd = ' Z';
    // var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    // var data = [{ type: 'scatter',
    //    x: [0], y:[0],
    //     marker: {size: 28, color:'850000'},
    //     showlegend: false,
    //     name: 'Scrubs Per Week',
    //     text: level,
    //     hoverinfo: 'text+name'},
    //   { values: [2, 2, 2, 2, 2, 2, 2, 2, 2, 18],
    //   rotation: 90,
    //   text: ['8-9', '7-8', '6-7', '5-6',
    //             '4-5', '3-4','2-3','1-2','0-1', ''],
    //   textinfo: 'text',
    //   textposition:'inside',
    //   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
    //                          'rgba(255, 255, 255, 0)']},
    //   labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2','0-1', ''],
    //   hoverinfo: 'label',
    //   hole: .5,
    //   type: 'pie',
    //   showlegend: false
    // }];
    
    // var layout = {
    //   shapes:[{
    //       type: 'path',
    //       path: path,
    //       fillcolor: '850000',
    //       line: {
    //         color: '850000'
    //       }
    //     }],
    //   title: 'Belly Button Washing Frequency Scrubs Per Week',
    //   autosize: true,
    //   margin: {
    //     l: 50,
    //     r: 50,
    //     b: 100,
    //     t: 100,
    //     pad: 4},
    //   xaxis: {zeroline:false, showticklabels:false,
    //              showgrid: false, range: [-1, 1]},
    //   yaxis: {zeroline:false, showticklabels:false,
    //              showgrid: false, range: [-1, 1]}
    // };
    
    // Plotly.newPlot('gauge', data, layout);
 
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_url="/samples/"+ sample;
  d3.json(sample_url).then(function(sample) {
    console.log(sample);
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sample.otu_ids,
      y: sample.sample_values, 
      mode: 'markers',
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      },
      text: sample.otu_labels
    };
    var data = [trace1];

    var layout = {
      title: "Belly Button Biodiversity Bubble Plot",
      xaxis: {
        title: "OTU ID"
      },
      height: 600,
      width: 1300
    };
    
    Plotly.newPlot("bubble", data, layout);

  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var sliced_sample_values = sample.sample_values.slice(0, 10);
    console.log(sliced_sample_values);
    var sliced_otu_ids = sample.otu_ids.slice(0, 10);
    console.log(sliced_otu_ids);
    var sliced_labels = sample.otu_labels.slice(0, 10);
    console.log(sliced_labels);

    var data = [{
        values : sliced_sample_values,
        labels : sliced_otu_ids,
        hovertext: sliced_labels,
        type: "pie"
    }];

    var layout = {
         height: 800,
         width: 1000
      };
  
    Plotly.newPlot("pie", data, layout);
});
};
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
