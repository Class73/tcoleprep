/*
=========================================================
subject-index.js
Auto-builds subject categories from existing
masterBank questions using prompt/explain keywords.

Requires:
    masterBank (loaded first)

Creates:
    window.subjectBank

No modifications required to question objects.
=========================================================
*/

window.subjectBank = {};

const SUBJECT_RULES = {
/*
    "Traffic Code": [
        "transportation code",
        "traffic",
        "vehicle",
        "roadway",
        "highway",
        "operator",
        "driver",
        "speed limit",
        "seat belt",
        "railroad crossing",
        "traffic signal",
        "child safety seat",
        "motor vehicle",
        "tail lamp",
        "turn signal",
        "urban district",
        "right-of-way"
    ],

    "Penal Code": [
        "penal code",
        "offense",
        "felony",
        "misdemeanor",
        "robbery",
        "burglary",
        "theft",
        "assault",
        "murder",
        "kidnapping",
        "arson",
        "criminal mischief",
        "public servant"
    ],

    "Code of Criminal Procedure": [
        "code of criminal procedure",
        "ccp",
        "magistrate",
        "complaint",
        "capias",
        "warrant",
        "arrest warrant",
        "search warrant",
        "habeas corpus",
        "indictment",
        "bail"
    ],

    "Family Code": [
        "family code",
        "juvenile",
        "child",
        "guardian",
        "protective order",
        "custody",
        "family violence",
        "custodian",
        "delinquent conduct"
    ],

    "Family Violence": [
        "family violence",
        "abuser",
        "abusive",
        "protective order",
        "victim",
        "cycle of violence",
        "domestic violence",
        "battering"
    ],

    "Use of Force": [
        "deadly force",
        "reasonable force",
        "use of force",
        "officer safety",
        "baton",
        "arrest",
        "physical arrest",
        "resisting arrest",
        "graham v. connor",
        "tennessee v. garner"
    ],

    "Mental Health": [
        "ptsd",
        "mental illness",
        "mental disorder",
        "schizophrenia",
        "paranoia",
        "psychosis",
        "depression",
        "delusion",
        "hallucination",
        "cit",
        "crisis intervention",
        "suicide"
    ],

    "Wellness": [
        "wellness",
        "fitness",
        "stress",
        "nutrition",
        "healthy life",
        "exercise",
        "weight loss",
        "cardiovascular",
        "fatigue",
        "wellness pyramid"
    ],

    "Patrol": [
        "patrol",
        "foot patrol",
        "motorcycle patrol",
        "problem area patrol",
        "community relations",
        "active shooter",
        "silhouetting",
        "cover",
        "concealment",
        "h.i.p.s",
        "traffic stop"
    ],

    "Criminal Investigation": [
        "criminal investigation",
        "crime scene",
        "crime scene sketch",
        "investigator",
        "interrogation",
        "interview",
        "evidence",
        "fingerprint",
        "lividity",
        "corpus delicti",
        "crime scene search"
    ],

    "Identity Theft": [
        "identity crime",
        "identity theft",
        "credit report",
        "equifax",
        "fraud alert",
        "financial institution",
        "ftc",
        "social security"
    ],

    "Hazmat": [
        "hazmat",
        "hazardous material",
        "hazardous materials",
        "flammable liquid",
        "ingestion",
        "inhalation",
        "absorption",
        "injection"
    ],

    "Canine Encounters": [
        "canine",
        "dog",
        "dog aggression",
        "bite",
        "ears",
        "tail",
        "growl",
        "canine encounters"
    ],

    "Crowd Control": [
        "riot",
        "mob",
        "crowd",
        "crowd management",
        "civil disorder",
        "acquisitive mob",
        "escape mob",
        "aggressive mob"
    ],

    "Constitutional Law": [
        "1st amendment",
        "2nd amendment",
        "4th amendment",
        "5th amendment",
        "6th amendment",
        "8th amendment",
        "constitution",
        "miranda",
        "reasonable suspicion",
        "probable cause",
        "search and seizure"
    ],

    "Civil Process": [
        "citation",
        "service",
        "civil procedure",
        "rule 106",
        "alternate service",
        "district court",
        "divorce",
        "tort"
    ],

    "TCOLE Rules": [
        "tcole",
        "218.3",
        "218.9",
        "training cycle",
        "proficiency certificate",
        "continuing education",
        "firearms qualification",
        "commission rule"
    ],

    "Drugs": [
        "controlled substance",
        "dangerous drug",
        "penalty group",
        "heroin",
        "marijuana",
        "marihuana",
        "drug paraphernalia",
        "narcotic",
        "delivery",
        "dispense"
    ],
*/	
	"Case Law": [
	"Case Law"
	],
	
	"CIT/De-escalation": [
	"De-escalation",
	"Definitions & CIT"
	],
	
	"Child Age Thresholds": [
	"Child Age"
	
	],
	
	"Definitions": [
	"Definitions"
	
	]	
	
};

/* -----------------------------------------
   Build subject arrays
----------------------------------------- */

masterBank.forEach(q => {

    const searchableText =
        (
            (q.prompt || "") +
            " " +
            (q.explain || "")
        )
        .toLowerCase();

    Object
        .entries(SUBJECT_RULES)
        .forEach(([subject, keywords]) => {

            const matched =
                keywords.some(
                    keyword =>
                        searchableText.includes(
                            keyword.toLowerCase()
                        )
                );

            if (!matched) return;

            if (!window.subjectBank[subject]) {
                window.subjectBank[subject] = [];
            }

            window.subjectBank[subject].push(q);
        });
});

/* -----------------------------------------
   Optional stats in console
----------------------------------------- */

console.log(
    "Subject Bank Built:"
);

Object.keys(subjectBank)
    .sort()
    .forEach(subject => {

        console.log(
            `${subject}: ${
                subjectBank[subject].length
            } questions`
        );
    });