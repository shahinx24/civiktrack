import { Department } from "@/types/department";

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: "dept-pwi",
    name: "Public Works & Infrastructure",
    code: "PWI",
    headOfficer: "Elena Rostova",
    email: "dispatch@pwi.gov.local",
    phone: "+1 (555) 100-2001",
    activeIssuesCount: 14,
    resolvedIssuesCount: 128,
    description:
      "Responsible for city roadway repairs, asphalt resurfacing, traffic signage, bridge maintenance, and storm drainage physical structures.",
  },
  {
    id: "dept-wsa",
    name: "Water & Sewerage Authority",
    code: "WSA",
    headOfficer: "David Kim",
    email: "emergency@wsa.gov.local",
    phone: "+1 (555) 100-2002",
    activeIssuesCount: 8,
    resolvedIssuesCount: 94,
    description:
      "Manages potable water distribution, mainline leak repairs, fire hydrants, sewer pipe blockages, and runoff management.",
  },
  {
    id: "dept-swm",
    name: "Sanitation & Waste Management",
    code: "SWM",
    headOfficer: "Carlos Mendez",
    email: "cleanstreets@swm.gov.local",
    phone: "+1 (555) 100-2003",
    activeIssuesCount: 11,
    resolvedIssuesCount: 156,
    description:
      "Oversees scheduled garbage collection, illegal dumping abatement, public bin emptying, and hazardous waste containment.",
  },
  {
    id: "dept-mue",
    name: "Municipal Utilities & Energy",
    code: "MUE",
    headOfficer: "Amara Okonjo",
    email: "grid@mue.gov.local",
    phone: "+1 (555) 100-2004",
    activeIssuesCount: 6,
    resolvedIssuesCount: 82,
    description:
      "Maintains public streetlighting networks, municipal power poles, traffic control electrical systems, and energy efficiency.",
  },
  {
    id: "dept-prd",
    name: "Parks & Recreation Department",
    code: "PRD",
    headOfficer: "Hannah Lindqvist",
    email: "parks@prd.gov.local",
    phone: "+1 (555) 100-2005",
    activeIssuesCount: 5,
    resolvedIssuesCount: 64,
    description:
      "Cares for community parks, public trees, playground safety inspections, recreational facilities, and civic greenbelts.",
  },
  {
    id: "dept-cse",
    name: "Civic Safety & Enforcement",
    code: "CSE",
    headOfficer: "Officer Ryan Vance",
    email: "civicsafety@cse.gov.local",
    phone: "+1 (555) 100-2006",
    activeIssuesCount: 4,
    resolvedIssuesCount: 47,
    description:
      "Handles sidewalk obstructions, dangerous structural hazards, code compliance, pedestrian crossings, and civic public safety issues.",
  },
];

