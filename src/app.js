import * as d3 from "d3";
import { RiTa as rita } from "rita";
import Sentiment from "sentiment";

// Define the regex pattern for the file names
const regex = /(.+)_(\d{4})\.txt/;

// List of text files (this should ideally come from your server)

const textFiles = [
  'Biden_2023.txt', 'Biden_2022.txt', 'Biden_2021.txt',
  'Trump_2019.txt', 'Trump_2020.txt',
  'Adams_1797.txt', 'Adams_1798.txt', 'Adams_1799.txt', 'Adams_1800.txt',
  'Adams_1825.txt', 'Adams_1826.txt', 'Adams_1827.txt', 'Adams_1828.txt',
  'Arthur_1881.txt', 'Arthur_1882.txt', 'Arthur_1883.txt', 'Arthur_1884.txt',
  'Buchanan_1857.txt', 'Buchanan_1858.txt', 'Buchanan_1859.txt', 'Buchanan_1860.txt',
  'Buren_1837.txt', 'Buren_1838.txt', 'Buren_1839.txt', 'Buren_1840.txt',
  'Bush_1989.txt', 'Bush_1990.txt', 'Bush_1991.txt', 'Bush_1992.txt',
  'Bush_2001.txt', 'Bush_2002.txt', 'Bush_2003.txt', 'Bush_2004.txt',
  'Bush_2005.txt', 'Bush_2006.txt', 'Bush_2007.txt', 'Bush_2008.txt',
  'Carter_1978.txt', 'Carter_1979.txt', 'Carter_1980.txt', 'Carter_1981.txt',
  'Cleveland_1885.txt', 'Cleveland_1886.txt', 'Cleveland_1887.txt', 'Cleveland_1888.txt',
  'Cleveland_1893.txt', 'Cleveland_1894.txt', 'Cleveland_1895.txt', 'Cleveland_1896.txt',
  'Clinton_1993.txt', 'Clinton_1994.txt', 'Clinton_1995.txt', 'Clinton_1996.txt',
  'Clinton_1997.txt', 'Clinton_1998.txt', 'Clinton_1999.txt', 'Clinton_2000.txt',
  'Coolidge_1923.txt', 'Coolidge_1924.txt', 'Coolidge_1925.txt', 'Coolidge_1926.txt',
  'Coolidge_1927.txt', 'Coolidge_1928.txt',
  'Eisenhower_1954.txt', 'Eisenhower_1955.txt', 'Eisenhower_1956.txt', 'Eisenhower_1957.txt',
  'Eisenhower_1958.txt', 'Eisenhower_1959.txt', 'Eisenhower_1960.txt', 'Eisenhower_1961.txt',
  'Fillmore_1850.txt', 'Fillmore_1851.txt', 'Fillmore_1852.txt',
  'Ford_1975.txt', 'Ford_1976.txt', 'Ford_1977.txt',
  'Grant_1869.txt', 'Grant_1870.txt', 'Grant_1871.txt', 'Grant_1872.txt',
  'Grant_1873.txt', 'Grant_1874.txt', 'Grant_1875.txt', 'Grant_1876.txt',
  'Harding_1921.txt', 'Harding_1922.txt',
  'Harrison_1889.txt', 'Harrison_1890.txt', 'Harrison_1891.txt', 'Harrison_1892.txt',
  'Hayes_1877.txt', 'Hayes_1878.txt', 'Hayes_1879.txt', 'Hayes_1880.txt',
  'Hoover_1929.txt', 'Hoover_1930.txt', 'Hoover_1931.txt', 'Hoover_1932.txt',
  'Jackson_1829.txt', 'Jackson_1830.txt', 'Jackson_1831.txt', 'Jackson_1832.txt',
  'Jackson_1833.txt', 'Jackson_1834.txt', 'Jackson_1835.txt', 'Jackson_1836.txt',
  'Jefferson_1801.txt', 'Jefferson_1802.txt', 'Jefferson_1803.txt', 'Jefferson_1804.txt',
  'Jefferson_1805.txt', 'Jefferson_1806.txt', 'Jefferson_1807.txt', 'Jefferson_1808.txt',
  'Johnson_1865.txt', 'Johnson_1866.txt', 'Johnson_1867.txt', 'Johnson_1868.txt',
  'Johnson_1964.txt', 'Johnson_1965.txt', 'Johnson_1966.txt', 'Johnson_1967.txt',
  'Johnson_1968.txt', 'Johnson_1969.txt',
  'Kennedy_1962.txt', 'Kennedy_1963.txt',
  'Lincoln_1861.txt', 'Lincoln_1862.txt', 'Lincoln_1863.txt', 'Lincoln_1864.txt',
  'Madison_1809.txt', 'Madison_1810.txt', 'Madison_1811.txt', 'Madison_1812.txt',
  'Madison_1813.txt', 'Madison_1814.txt', 'Madison_1815.txt', 'Madison_1816.txt',
  'McKinley_1897.txt', 'McKinley_1898.txt', 'McKinley_1899.txt', 'McKinley_1900.txt',
  'Monroe_1817.txt', 'Monroe_1818.txt', 'Monroe_1819.txt', 'Monroe_1820.txt',
  'Monroe_1821.txt', 'Monroe_1822.txt', 'Monroe_1823.txt', 'Monroe_1824.txt',
  'Nixon_1970.txt', 'Nixon_1971.txt', 'Nixon_1972.txt', 'Nixon_1973.txt', 'Nixon_1974.txt',
  'Obama_2009.txt', 'Obama_2010.txt', 'Obama_2011.txt', 'Obama_2012.txt',
  'Obama_2013.txt', 'Obama_2014.txt', 'Obama_2015.txt', 'Obama_2016.txt',
  'Pierce_1853.txt', 'Pierce_1854.txt', 'Pierce_1855.txt', 'Pierce_1856.txt',
  'Polk_1845.txt', 'Polk_1846.txt', 'Polk_1847.txt', 'Polk_1848.txt',
  'Reagan_1982.txt', 'Reagan_1983.txt', 'Reagan_1984.txt', 'Reagan_1985.txt',
  'Reagan_1986.txt', 'Reagan_1987.txt', 'Reagan_1988.txt',
  'Roosevelt_1901.txt', 'Roosevelt_1902.txt', 'Roosevelt_1903.txt', 'Roosevelt_1904.txt',
  'Roosevelt_1905.txt', 'Roosevelt_1906.txt', 'Roosevelt_1907.txt', 'Roosevelt_1908.txt',
  'Roosevelt_1934.txt', 'Roosevelt_1935.txt', 'Roosevelt_1936.txt', 'Roosevelt_1937.txt',
  'Roosevelt_1938.txt', 'Roosevelt_1939.txt', 'Roosevelt_1940.txt', 'Roosevelt_1941.txt',
  'Roosevelt_1942.txt', 'Roosevelt_1943.txt', 'Roosevelt_1944.txt', 'Roosevelt_1945.txt',
  'Taft_1909.txt', 'Taft_1910.txt', 'Taft_1911.txt', 'Taft_1912.txt',
  'Taylor_1849.txt',
  'Truman_1946.txt', 'Truman_1947.txt', 'Truman_1948.txt', 'Truman_1949.txt',
  'Truman_1950.txt', 'Truman_1951.txt', 'Truman_1952.txt', 'Truman_1953.txt',
  'Trump_2017.txt', 'Trump_2018.txt',
  'Tyler_1841.txt', 'Tyler_1842.txt', 'Tyler_1843.txt', 'Tyler_1844.txt',
  'Washington_1790.txt', 'Washington_1791.txt', 'Washington_1792.txt', 'Washington_1793.txt',
  'Washington_1794.txt', 'Washington_1795.txt', 'Washington_1796.txt',
  'Wilson_1913.txt', 'Wilson_1914.txt', 'Wilson_1915.txt', 'Wilson_1916.txt',
  'Wilson_1917.txt', 'Wilson_1918.txt', 'Wilson_1919.txt', 'Wilson_1920.txt'
];


// Extract unique presidents and years from textFiles
const presidents = [...new Set(textFiles.map(file => file.split('_')[0]))];
const years = [...new Set(textFiles.map(file => file.match(/\d{4}/)[0]))];
const articles = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "so", "yet", "to", "of", "in", "on", "at", "by", "with", "from", "as", "if", "that", "this", "these", "those", "it", "its", "senate", "house", "i" ]);

const sentiment = new Sentiment();

// Function to populate the president dropdown
const populatePresidentDropdown = () => {
  const presidentSelect = d3.select("#presidentSelect");

  presidentSelect.selectAll("option")
    .data(presidents)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);
};

// Function to populate the year dropdown based on selected president
const populateYearDropdown = (president) => {
  const yearSelect = d3.select("#yearSelect");
  yearSelect.selectAll("option").remove(); // Clear previous options

  const filteredFiles = textFiles.filter(file => file.startsWith(president));
  const uniqueYears = [...new Set(filteredFiles.map(file => file.match(/\d{4}/)[0]))];

  yearSelect.selectAll("option")
    .data(uniqueYears)
    .enter()
    .append("option")
    .attr("value", year => `${president}_${year}.txt`)
    .text(year => year);
};

// Function to fetch and process the selected file
const fetchData = async (filename) => {
  try {
    const text = await d3.text(`./public/text/${filename}`); // Load the selected file
    const tokens = rita.tokenize(text); // Tokenize the file content
    console.log(`Tokens for file ${filename}:`, tokens); // Log the tokens
    // Count word frequencies and get top words
    const frequency = countWordFrequencies(tokens);
    const topWords = getTopWords(frequency);

    displayTopWords(topWords); // Display the top words before tokens
    
    return tokens; // Return the tokens
  } catch (err) {
    console.error('Error fetching file:', err); // Handle errors
  }
};

// Sentiment scale
const sentimentScale = d3.scaleOrdinal()
  .domain(['very positive', 'positive', 'neutral', 'negative', 'very negative'])
  .range(['green', 'lightgreen', 'lightgray', 'pink', 'red']);

// Event listener for president dropdown change
d3.select("#presidentSelect").on("change", function() {
  const selectedPresident = d3.select(this).property("value");
  if (selectedPresident) {
    populateYearDropdown(selectedPresident); // Populate years based on selected president
  }
});

// Event listener for year dropdown change
d3.select("#yearSelect").on("change", async function() {
  const selectedFile = d3.select(this).property("value");
  if (selectedFile) {
    const data = await fetchData(selectedFile);
    
    displayTokens(data);
  }
});

// Function to display tokens with sentiment analysis
const displayTokens = (data) => {
  const app = d3.select('#app');
  app.selectAll('span').remove(); // Clear previous tokens

  app.selectAll('span')
    .data(data)
    .enter()
    .append('span')
    .text((d) => d + ' ') // Add a space after each token
    .style('color', (d) => {
      const sentimentScore = calculateSentiment(d);
      return sentimentScale(sentimentScore);
    });
};

// Function to calculate sentiment
const calculateSentiment = (str) => {
  const result = sentiment.analyze(str);

  const score = result.score;

  const test_number = 0.5;

  if (score > test_number) {
    return 'very positive';
  }
  if (score > 0 && score <= test_number) {
    return 'positive';
  }
  if (score < 0 && score >= -test_number) {
    return 'negative';
  }
  if (score < -test_number) {
    return 'very negative';
  } else {
    return 'neutral';
  }
};

// Initialize the dropdowns
populatePresidentDropdown();

// Function to calculate stress of words
const whatIsStressed = (str) => {
  
  const score = rita.stresses(str);
  console.log(score)
  const test_number = 0.5;

  if (score == 1) {
    return 'very positive';
  } else {
    return 'neutral';
  }
};


// Function to calculate how many times 'tax' appears in a string
const taxScore = (str) => {
  // Normalize the string to lowercase
  const lowerStr = str.toLowerCase();
  
  // Use a regular expression to find all occurrences of 'tax'
  const regex = /tax/g; // 'g' flag for global search
  const matches = lowerStr.match(regex); // Returns an array of matches

  // Calculate the score based on the number of matches
  const score = matches ? matches.length : 0; // If no matches, score is 0

  console.log(score); // Log the score

  // Determine sentiment based on the score
  if (score > 1) {
      return 'very positive';
  } else {
      return 'neutral';
  }
};

// Function to filter out articles and count word frequencies
const countWordFrequencies = (tokens) => {
  const frequency = {};

  tokens.forEach(token => {
      const lowerToken = token.toLowerCase();
      // Skip articles
      if (!articles.has(lowerToken) && lowerToken.length > 0 && /^[a-z]+$/.test(lowerToken)) {
          frequency[lowerToken] = (frequency[lowerToken] || 0) + 1;
      }
  });

  return frequency;
};

// Function to get the top 10 most used words
const getTopWords = (frequency) => {
  console.log(frequency)
  // Convert frequency object to an array and sort it
  let return_words = Object.entries(frequency)
    .filter(([word]) => isNaN(word)) // Exclude any entries where the word is a number
    .map(([word]) => word) // Return only words
    .sort(([, a], [, b]) => b - a) // Sort by frequency
    .slice(0, 10); // Get top 10

      
      console.log(return_words)
  return return_words
};

// Function to display the top 10 words
const displayTopWords = (topWords) => {
  const app = d3.select('#app');
  app.selectAll('.top-words').remove(); // Clear previous top words

  const topWordsContainer = app.append('div').attr('class', 'top-words');
  
  topWordsContainer.append('h3').text('Top 10 Most Used Words:');
  
  topWords.forEach(word => {
      topWordsContainer.append('span')
          .text(word + ' ')
          .style('font-weight', 'bold');
  });
};

