const locationGroups = {
  Gujarat: [
    "rajkot",
    "ahmedabad",
    "surat",
    "vadodara",
    "gandhinagar",
    "bhavnagar",
    "jamnagar",
    "junagadh",
    "anand",
    "mehsana",
    "navsari",
    "bharuch",
    "morbi",
    "nadiad",
    "vapi",
    "porbandar",
    "gujarat",
  ],
  Maharashtra: ["mumbai", "pune", "nagpur", "nashik", "thane", "aurangabad", "maharashtra"],
  Delhi: ["delhi", "new delhi"],
  Karnataka: ["bengaluru", "bangalore", "mysuru", "mangalore", "karnataka"],
  Telangana: ["hyderabad", "telangana"],
  Haryana: ["gurugram", "gurgaon", "faridabad", "haryana"],
  "Uttar Pradesh": ["noida", "lucknow", "kanpur", "agra", "varanasi", "uttar pradesh"],
  "Tamil Nadu": ["chennai", "coimbatore", "madurai", "tamil nadu"],
  Punjab: ["chandigarh", "ludhiana", "amritsar", "punjab"],
  Rajasthan: ["jaipur", "udaipur", "jodhpur", "rajasthan"],
  "West Bengal": ["kolkata", "howrah", "west bengal"],
};

const normalizeText = (value) => String(value ?? "").toLowerCase().trim();

const matchesLocationGroup = (jobLocation, query) => {
  const normalizedLocation = normalizeText(jobLocation);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;

  if (normalizedLocation.includes(normalizedQuery)) {
    return true;
  }

  const group = locationGroups[query] || locationGroups[Object.keys(locationGroups).find((key) => normalizeText(key) === normalizedQuery)];

  if (!group) return false;

  return group.some((city) => normalizedLocation.includes(city));
};

export const matchesJobQuery = (job, query) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;

  const searchableFields = [
    job?.title,
    job?.description,
    job?.jobType,
    job?.company?.name,
    job?.company?.location,
  ];

  const textMatch = searchableFields.some((field) => normalizeText(field).includes(normalizedQuery));
  if (textMatch) return true;

  return matchesLocationGroup(job?.location, query);
};

export const locationGroupsMap = locationGroups;