# Pain Machines — Sources

Bibliography for [Pain Machines](/posts/pain_machines/). Each entry notes how it maps to the state-space model, charts, or argument.

## A. Pain measurement & clinical taxonomy

- **Melzack R (1975).** [The McGill Pain Questionnaire: major properties and scoring methods](https://pubmed.ncbi.nlm.nih.gov/1235985/). *Pain* 1(3):277–299.  
  *78-descriptor inventory in Figure 2; sensory / affective / evaluative subclasses.*

- **McGill University.** [McGill Pain Questionnaire resource page](https://www.mcgill.ca/painresearch/research/mcgill-pain-questionnaire).  
  *Instrument history and SF-MPQ revisions.*

- **Treede RD et al. (2022).** [Classification of chronic pain for the ICD-11](https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx). *Pain* 163(2):e1–e14.  
  *Seven chronic-pain categories; biopsychosocial framing → `pain_mechanism` axis.*

- **IASP.** [Structure of the ICD-11 chronic pain classification (MG30)](https://www.iasp-pain.org/advocacy/structure-of-the-icd-11-classification/).  
  *Operational ICD-11 hierarchy.*

- **Raja SN et al. (2020).** [The revised IASP definition of pain](https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/). *Pain* 161(9):1976–1982.  
  *Pain as inseparable sensory + emotional experience.*

- **IASP.** [Revised definition of pain flysheet (2020)](https://www.iasp-pain.org/wp-content/uploads/2022/04/revised-definition-flysheet_R2-1-1-1.pdf).

## B. Pain as multidimensional construct

- **Melzack R (2001).** [Pain and the neuromatrix in the brain](https://pubmed.ncbi.nlm.nih.gov/11780656/). *J Dent Educ* 65(12):1378–1382.  
  *Neuromatrix model → `episodic_embedding` axis.*

- **Price DD (2000).** [Psychological and neural mechanisms of the affective dimension of pain](https://doi.org/10.1126/science.288.5472.1769). *Science* 288(5472):1769–1772.  
  *Sensation vs unpleasantness vs secondary affect; non-collapsing pain dimensions.*

- **Berns GS et al. (2008).** [The price of pain and the value of suffering](https://pubmed.ncbi.nlm.nih.gov/18607258/). *Psychol Sci* 19(4):309–317.  
  *Behavioral market for pain avoidance; suffering not a fungible SKU.*

- **Lazarus RS, Folkman S (1984).** [*Stress, Appraisal, and Coping*](https://archive.org/details/stressappraisalc0000laza). Springer.  
  *Appraisal families → `pain_appraisal` axis.*

- **Hunt SP, Mantyh PW (2001).** [The molecular dynamics of pain control](https://www.nature.com/articles/35053509). *Nat Rev Neurosci* 2:83–91.  
  *Parallel sensory vs affective pain pathways.*

- **Treede RD et al. (2008).** [Neuropathic pain: redefinition and a grading system](https://pubmed.ncbi.nlm.nih.gov/18003941/). *Neurology* 70(18):1630–1635.  
  *Mechanism taxonomy: nociceptive / neuropathic / nociplastic.*

## C. Hedonic compression & reward neuroscience

- **Berridge KC, Kringelbach ML (2015).** [Pleasure systems in the brain](https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/). *Neuron* 86(3):646–664.  
  *Hedonic hotspots; common neural currency → `pharmacological_quotient`.*

- **Berridge KC, Kringelbach ML (2010).** [Affective neuroscience of pleasure](https://pmc.ncbi.nlm.nih.gov/articles/PMC3004012/).  
  *Liking vs wanting vs learning.*

- **Leknes S, Tracey I (2008).** [A common neurobiology for pain and pleasure](https://www.nature.com/articles/nrn2333). *Nat Rev Neurosci* 9:314–320.  
  *Opioid/dopamine overlap; engineered bliss substitutability.*

- **FDA.** [Drugs@FDA approved products database](https://www.accessdata.fda.gov/scripts/cder/daf/).  
  *Ground truth for ~11-class pharmacopeia inventory check.*

## D. Affective asymmetry & negative dominance

- **Baumeister RF et al. (2001).** [Bad is stronger than good](https://doi.org/10.1037/1089-2680.5.4.323). *Review of General Psychology* 5(4):323–370.

- **Rozin P, Royzman EB (2001).** [Negativity bias, negativity dominance, and contagion](https://doi.org/10.1207/S15327957PSPR0504_2). *Perspectives on Psychological Science*.  
  *Negative differentiation — negative states more varied (high cardinality).*

- **Ito TA et al. (1998).** [Negative information weighs more heavily on the brain](https://doi.org/10.1037/0022-3514.75.4.887). *JPSP* 75(4):887–900.

- **Cacioppo JT, Berntson GG (1999).** [The affect system](https://doi.org/10.1037/0033-295X.105.3.482). *Psychological Review*.

- **Kahneman D, Tversky A (1979).** [Prospect theory](https://doi.org/10.2307/1914185). *Econometrica* 47(2):263–291.  
  *Loss aversion; economic parallel to pain/pleasure gap.*

## E. Psychophysics & measurement

- **Stanford Encyclopedia of Philosophy.** [Weber-Fechner law](https://plato.stanford.edu/entries/weber-fechners-law/).  
  *JND bins on `pleasure_intensity` axis.*

- **Shirley Ryan AbilityLab.** [McGill Pain Questionnaire profile](https://www.sralab.org/rehabilitation-measures/mcgill-pain-questionnaire).  
  *Independent replication of 78-word structure.*

## F. Model code

- [model.py](/research/pain_machines/model.py)
- [README.md](/research/pain_machines/README.md)
