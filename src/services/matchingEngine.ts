import { Opportunity, CandidateProfile, MatchResult } from '../types';

export function calculateMatch(opportunity: Opportunity, profile: CandidateProfile | null): MatchResult {
  if (!profile) {
    return {
      compatibilityPercentage: 70,
      reasons: ['قم بإنشاء وتسجيل ملفك الشخصي لتحديد نسبة التوافق الدقيقة!'],
      matchingSkills: [],
      missingSkills: opportunity.requiredSkills || []
    };
  }

  let totalWeight = 0;
  let earnedScore = 0;
  const reasons: string[] = [];
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  // 1. Skill Matching (Weight: 40)
  totalWeight += 40;
  const profileSkills = (profile.skills || []).map(s => (typeof s === 'string' ? s : s?.name || '').toLowerCase().trim());
  const requiredSkills = opportunity.requiredSkills || [];

  if (requiredSkills.length > 0) {
    let skillMatchCount = 0;
    requiredSkills.forEach(reqSkill => {
      const isMatch = profileSkills.some(userSkill => 
        userSkill.includes(reqSkill.toLowerCase().trim()) || 
        reqSkill.toLowerCase().trim().includes(userSkill)
      );
      if (isMatch) {
        skillMatchCount++;
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillRatio = skillMatchCount / requiredSkills.length;
    earnedScore += skillRatio * 40;

    if (skillMatchCount > 0) {
      reasons.push(`تمتلك ${skillMatchCount} من المهارات المطلوبة (${matchingSkills.slice(0, 3).join('، ')})`);
    }
  } else {
    earnedScore += 40; // No strict skills required
  }

  // 2. Education Matching (Weight: 20)
  totalWeight += 20;
  const educationRank: Record<string, number> = {
    'any': 1,
    'high_school': 2,
    'diploma': 3,
    'bachelor': 4,
    'master': 5,
    'phd': 6
  };

  const userEduRank = educationRank[profile.educationLevel || 'bachelor'] || 4;
  const reqEduRank = educationRank[opportunity.educationLevel || 'any'] || 1;

  if (userEduRank >= reqEduRank || opportunity.educationLevel === 'any') {
    earnedScore += 20;
    reasons.push('مستواك التعليمي مؤهل للفرصة');
  } else {
    earnedScore += 10; // Partial score
  }

  // 3. Governorate / Location / Remote Matching (Weight: 25)
  totalWeight += 25;
  const isUserGovernorateMatch = profile.governorate === opportunity.governorate || 
    (profile.preferredLocations && profile.preferredLocations.includes(opportunity.governorate));
  
  if (opportunity.isRemote || opportunity.governorate === 'عن بُعد') {
    earnedScore += 25;
    reasons.push('الفرصة تتيح العمل عن بُعد (مرونة المكان)');
  } else if (isUserGovernorateMatch) {
    earnedScore += 25;
    reasons.push(`الموقع في محافظتك (${opportunity.governorate})`);
  } else {
    earnedScore += 10;
  }

  // 4. Interests / Category Alignment (Weight: 15)
  totalWeight += 15;
  if (profile.interests && profile.interests.includes(opportunity.category)) {
    earnedScore += 15;
    reasons.push('الفرصة ضمن المجالات والاهتمامات التي حددتها');
  } else {
    earnedScore += 8;
  }

  // Final Percentage Calculation (Minimum 50% to stay encouraging)
  const rawPercentage = Math.round((earnedScore / totalWeight) * 100);
  const compatibilityPercentage = Math.max(50, Math.min(98, rawPercentage));

  if (reasons.length === 0) {
    reasons.push('تفاصيل ملفك توفر أساساً جيدا لهذه الفرصة');
  }

  return {
    compatibilityPercentage,
    reasons,
    matchingSkills,
    missingSkills
  };
}
