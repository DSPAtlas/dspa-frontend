import "@nightingale-elements/nightingale-sequence@latest";
import "@nightingale-elements/nightingale-track@latest";
import "@nightingale-elements/nightingale-manager@latest";
import "@nightingale-elements/nightingale-navigation@latest";
  import "@nightingale-elements/nightingale-colored-sequence@latest";

  const accession = "P05067";
  //const accession = "P00925";
  
  // Load feature and variation data from Proteins API
  const featuresData = await (
    await fetch("https://www.ebi.ac.uk/proteins/api/features/" + accession)
  ).json();

  customElements.whenDefined("nightingale-sequence").then(() => {
    const seq = document.querySelector("#sequence");
    seq.data = featuresData.sequence;
  });
  
  customElements.whenDefined("nightingale-colored-sequence").then(() => {
    const coloredSeq = document.querySelector("#colored-sequence");
    coloredSeq.data = featuresData.sequence;
  }); 
  
  console.log(featuresData.sequence);
  customElements.whenDefined("nightingale-track").then(() => {
    // Nightingale expects begin rather than the API's begin
    const features = featuresData.features.map((ft) => ({
      ...ft,
      start: ft.start || ft.begin,
    }));

    console.log(features);

    fetch('lip.json')
      .then(response => response.json())
      .then(lipData => {
        // Append the data from lip.json to the features array
        console.log(lipData);
        const updatedFeatures = features.concat(lipData);
        const residueLevel = document.querySelector("#residue-level");
        residueLevel.data = updatedFeatures.filter(({ type }) => type === "LIP");
      })
    .catch(error => console.error('Error loading the JSON file:', error));
  
    // Filter the data for each feature type and assign to the relevant track data
    const domain = document.querySelector("#domain");
    domain.data = features.filter(({ type }) => type === "DOMAIN");
  
    const region = document.querySelector("#region");
    region.data = features.filter(({ type }) => type === "REGION");
  
    const site = document.querySelector("#site");
    site.data = features.filter(({ type }) => type === "SITE");
  
    const binding = document.querySelector("#binding");
    binding.data = features.filter(({ type }) => type === "BINDING");
 
    const chain = document.querySelector("#chain");
    chain.data = features.filter(({ type }) => type === "CHAIN");
 
    const disulfide = document.querySelector("#disulfide-bond");
    disulfide.data = features.filter(({ type }) => type === "DISULFID");
 
    const betaStrand = document.querySelector("#beta-strand");
    betaStrand.data = features.filter(({ type }) => type === "STRAND");