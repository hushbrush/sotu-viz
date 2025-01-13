// Load the list of speech text files
const fileList = await d3.json("public/fileList.json"); // Adjust the path as needed

import topicKeywords from './topicKeywords.js'; // Adjust the path if needed

// Set dimensions and margins for the chart
const width = window.innerWidth/5;
const height = 800;
let party;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

 // Define a color scale or a simple color assignment based on the party
 const partyColour = d3.scaleOrdinal()
    .domain(["Democrat", "Republican", "whig", "Federalist", "Democratic-Republican"]) // Add more parties if needed
    .range(["#878fff", "#ffab87", "#394e85", "#befac4" ,"#9adce3"]);


 
    
function displaySpeechTitle(title, container) {
        // Create an h3 element to hold the title
        const h3 = document.createElement("h3");
        
        // Set the title text
        h3.textContent = title;
        
        // Optionally, add a class for styling
        h3.classList.add("speech-title");
        
        // Insert the h3 element before the container's first child
        container.insertBefore(h3, container.firstChild);
    }
    

// Preprocess the speech text
async function preprocessSpeechText(speechFile) {
    const speechText = await d3.text(`public/text/${speechFile}`);
    const cleanText = speechText.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
    return cleanText.split(/\s+/);
}

// Count occurrences of keywords
function countKeywords(words) {
    const topicCounts = {};
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        topicCounts[topic] = keywords.reduce((count, keyword) => {
            return count + words.filter(word => word === keyword).length;
        }, 0);
    }
    return topicCounts;
}

function groupByPresident(fileList) {
    const grouped = {};
    fileList.forEach(file => {
        const president = file.name; // Assuming fileList has a 'name' property for president
        if (!grouped[president]) {
            grouped[president] = [];
        }
        grouped[president].push(file);
    });
    return grouped;
}

// Function to populate the president dropdown
function populateDropdown(groupedByPresident) {
    const dropdown = document.getElementById("presidentDropdown");
    for (const president in groupedByPresident) {
        const option = document.createElement("option");
        option.value = president;
        option.textContent = president;
        dropdown.appendChild(option);
    }

    // Add event listener for dropdown change
    dropdown.addEventListener("change", function () {
        const selectedPresident = this.value;
        if (selectedPresident) {
            scrollToPresident(selectedPresident);
        }
    });
}

// Scroll to the selected president's section
function scrollToPresident(president) {
    const element = document.getElementById(president);
    if (element) {
        // Calculate the offset position
        const targetPosition = element.offsetTop - 200; // Adjust offset as needed
        const maxScrollPosition = document.body.scrollHeight - window.innerHeight;

        // Ensure we don't try to scroll beyond the bottom of the page
        const scrollToPosition = Math.min(targetPosition, maxScrollPosition);

        window.scrollTo({
            top: scrollToPosition,
            behavior: "smooth"
        });
    } else {
        console.warn(`Element with ID ${president} not found.`); // Debugging line
    }
}


async function createCharts() {

    const groupedByPresident = groupByPresident(fileList); // Group speeches by president
    // Create an SVG container for the legend
    const introSVG = d3.create("svg")
        .attr("width", window.innerWidth)  // Width for the intro SVG
        .attr("height", 0) // Height for the intro SVG
        .attr("id", "intro"); // Set an ID for reference
        
       
   
    


   
    populateDropdown(groupedByPresident); // Populate dropdown with presidents
    createLegend(introSVG);
    const chartWidth = 300; // Width of each radar chart
    let yOffset = 150; // Track the current y-position for each president's row

    

    // Append the legend SVG to the container
    document.getElementById("container").appendChild(introSVG.node());

    // Iterate through each president group
    for (const president in groupedByPresident) {
        const speeches = groupedByPresident[president]; // All speeches for the current president
        let xOffset = 40; // Reset xOffset for each president
        
        // Create a container for the president's section
        const presidentSection = document.createElement("div");
        presidentSection.setAttribute("class", "president-section");
        presidentSection.setAttribute("id", president); // Set the ID to match the president's name
        presidentSection.setAttribute("data-president", president); // Set data attribute for scrolling
        presidentSection.style.display = "flex"; // Use flexbox for alignment
        presidentSection.style.flexDirection = "column"; // Stack title and charts vertically
        presidentSection.style.alignItems = "flex-start"; // Align items to the left
        document.getElementById("container").appendChild(presidentSection); // Append to main container

        // Display the speech title
        displaySpeechTitle(president, presidentSection); // Pass the container to insert the title

        // Create a wrapper for the SVGs
        const svgWrapper = document.createElement("div");
        svgWrapper.style.display = "flex"; // Use flexbox for SVGs alignment
        svgWrapper.style.flexWrap = "wrap"; // Allow SVGs to wrap if needed
        svgWrapper.style.marginTop = "10px"; // Add margin for spacing

        // Loop through each speech and create a chart
        for (let i = 0; i < speeches.length; i++) {
            const file = speeches[i];
            const file_name = `${file.name}_${file.year}.txt`;

            // Update party variable if necessary
            party = file.party;

            // Create the SVG and append it to the wrapper
            const svg = await createPetalChart(file_name, i, xOffset, yOffset, party); // Don't pass the container here
            svgWrapper.appendChild(svg.node()); // Append SVG to wrapper

            // Move the xOffset for the next chart in the same row
            xOffset += chartWidth + 40; // Spacing between charts
        }

        // Append the SVG wrapper to the president section
        presidentSection.appendChild(svgWrapper);

        // Move the yOffset down for the next president's row
        yOffset += 300 + 40; // Chart height + margin
    }
}


// Create petal chart
async function createPetalChart(speechFile, index, xOffset, yOffset, party) {
    const words = await preprocessSpeechText(speechFile);
    const topicCounts = countKeywords(words);

    const educationCount = topicCounts['Education'] || 0;
    const economyCount = topicCounts['Economy'] || 0;
    const healthcareCount = topicCounts['Healthcare'] || 0;
    const warCount = topicCounts['War'] || 0;
    const nationalCount = topicCounts["National Security"] || 0;
    const devCount = topicCounts["Infrastructure and Urban Development"] || 0;
    const climateCount = topicCounts["Climate"] || 0;

    // Set up SVG dimensions
    const svgWidth = 300;
    const svgHeight = 300;

    // Create an SVG container
    const svg = d3.create("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("margin", "10px 20px") // Margin for spacing
    .style("border", "0.5px solid white"); // Add white border of 2px


    const g = svg.append("g")
        .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`);

    const maxPetalLength = 100;
    const maxPetalBreadth = 40;

    const applyJitter = (value) => value + (Math.random() - 0.5) * nationalCount / 3;

    const angleScale = d3.scaleLinear()
        .domain([1, healthcareCount])
        .range([0, 2 * Math.PI]);

    for (let i = 1; i < healthcareCount+1; i++) {
        const angle = angleScale(i);
        const petalLength = (economyCount / 10) * maxPetalLength;
        const petalBreadth = (educationCount / 10) * maxPetalBreadth;

        const points = [
            [applyJitter(0), applyJitter(0)],
            [applyJitter(Math.cos(angle - 0.1) * petalBreadth), applyJitter(Math.sin(angle - 0.1) * petalBreadth)],
            [applyJitter(Math.cos(angle) * petalLength), applyJitter(Math.sin(angle) * petalLength)],
            [applyJitter(Math.cos(angle + 0.1) * petalBreadth), applyJitter(Math.sin(angle + 0.1) * petalBreadth)]
        ];

        const petalPath = d3.line()
            .x(d => d[0])
            .y(d => d[1]);

            g.append("path")
            .attr("d", petalPath(points))
            .attr("fill", partyColour(party))
            .attr("fill-opacity", 0.3) // Set fill opacity to 0.5
            .attr("stroke", partyColour(party))
            .attr("stroke-width", 3)
            .attr("stroke-opacity", 1) // Set stroke opacity to 1
        
    }

    g.append("circle")
        .attr("r", warCount * 3.2)
        .attr("fill", "#fff")
        .attr("opacity", 0.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);


    g.append("circle")
        .attr("r", devCount * 3.2)
        .attr("fill", "none")
        .attr("opacity", 1)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 10);

    // Function to create a spiral
    const drawSpiral = (cx, cy, numLoops, radius) => {
        const spiralPoints = [];
        const numPoints = 100; // Number of points to create the spiral

        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * (2 * Math.PI * numLoops);
            const r = radius * (i / numPoints); // Increasing radius
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            spiralPoints.push([x, y]);
        }

        const spiralPath = d3.line()
            .x(d => d[0])
            .y(d => d[1]);

        g.append("path")
            .attr("d", spiralPath(spiralPoints))
            .attr("fill", "none")
            .attr("stroke", "#e1fced")
            .attr("stroke-width", 2)
            .attr("opacity", 1);
    };

    // Draw spirals in each corner
    const spiralSize = climateCount*2; // Size of the spiral
    drawSpiral(-svgWidth / 2 + spiralSize, -svgHeight / 2 + spiralSize, 3, spiralSize); // Top-left
    drawSpiral(svgWidth / 2 - spiralSize, -svgHeight / 2 + spiralSize, 3, spiralSize); // Top-right
    drawSpiral(-svgWidth / 2 + spiralSize, svgHeight / 2 - spiralSize, 3, spiralSize); // Bottom-left
    drawSpiral(svgWidth / 2 - spiralSize, svgHeight / 2 - spiralSize, 3, spiralSize); // Bottom-right


    return svg; // Return the SVG for further use
}

// Start creating charts
createCharts();

function createLegend(svg) {
    let xpos = 20;
    // Define legend data for parties
    const legendData = [
        { party: "Democrat", color: "#a0b0fa", description: "Democrat speeches" },
        { party: "Republican", color: "#fc6a6a", description: "Republican speeches" },
        { party: "Whig", color: "#394e85", description: "Whig speeches" },
        { party: "Federalist", color: "#befac4", description: "Federalist speeches" },
        { party: "Democratic-Republican", color: "#9adce3", description: "Democratic-Republican speeches" },
    ];

    // Define legend data for shapes
    const legendData2 = [
        { shape: "filledInCircle", description: "Filled in White Circle = War" },
        { shape: "petalLength", description: "Length of petal = Economy" },
        { shape: "petalBreadth", description: "Breadth of petal = Education" },
        { shape: "jitteriness", description: "Jitteriness = National Security" },
        { shape: "numberOfPetals", description: "Number Of Petals = Healthcare" },
        { shape: "numberOfPetals", description: "Opaque ring = Infrastructure" },
        { shape: "numberOfPetals", description: "Size of spirals = Climate" }
    ];

    // Create a div to hold the legend and apply styles
    const legendDiv = d3.select("body")
        .append("div")
        .attr("class", "legend-container")
        .style("position", "fixed")
        .style("bottom", "20px")
        .style("right", "20px")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("padding", "10px")
        .style("border-radius", "8px");

    // Create a group for the legend inside the div
    const legendGroup = legendDiv.append("svg")
    .attr("width", 280)  // Reduce the width since we're going vertical
    .attr("height", 400) // Increase height to fit both sections
    .append("g")
    .attr("transform", `translate(0, 0)`);

        

    // Colours section
    let yOffset = 20; // Initial yOffset to keep track of vertical position

    legendGroup.append("text")
        .attr('x', xpos)
        .attr("y", yOffset) // Align text vertically
        .text("Colours:")
        .attr("font-size", "24px")
        .attr("fill", "#fff") // Text color
        .style("font-family", "sztos-variable, sans-serif") // Change font family
        .style("font-variation-setting", "'wght' 50, 'wdth' 100");

    yOffset += 30;  // Move down a bit for the items

    // Create legend items for parties, stacking vertically
    legendData.forEach((item, index) => {
        // Circle for color
        legendGroup.append("circle")
            .attr("cx", xpos+20)
            .attr("cy", yOffset + (index * 25)) // Space between items
            .attr("r", 7)
            .attr("fill", item.color);

        // Text description
        legendGroup.append("text")
            .attr("x", xpos+40)
            .attr("y", yOffset + (index * 25) + 5) // Align text vertically
            .text(item.description)
            .attr("font-size", "14px")
            .attr("fill", "#fff")
            .style("font-family", "sztos-variable, sans-serif")
            .style("font-variation-settings", "'wght' 150, 'wdth' 170");
    });

    // Update yOffset for the Shapes section (Add space between sections)
    yOffset += (legendData.length * 25) + 40;

    // Shapes section
    legendGroup.append("text")
        .attr('x', xpos)
        .attr("y", yOffset) // Align text vertically
        .text("Shapes:")
        .attr("font-size", "24px")
        .attr("fill", "#fff") // Text color
        .style("font-family", "sztos-variable, sans-serif") // Change font family
        .style("font-variation-setting", "'wght' 50, 'wdth' 100");

    yOffset += 30;  // Move down for the items

    // Create legend items for shapes, stacking vertically
    legendData2.forEach((item, index) => {
        // Shape indicator (circle for now)
        legendGroup.append("circle")
            .attr("cx", xpos+20)
            .attr("cy", yOffset + (index * 25)) // Space between items
            .attr("r", 4)
            .attr("fill", "#fff");

        // Text description for shapes
        legendGroup.append("text")
            .attr("x", xpos+40)
            .attr("y", yOffset + (index * 25) + 5) // Align text vertically
            .text(item.description)
            .attr("font-size", "14px")
            .attr("fill", "#fff")
            .style("font-family", "sztos-variable, sans-serif")
            .style("font-variation-settings", "'wght' 150, 'wdth' 170");
    });
}



