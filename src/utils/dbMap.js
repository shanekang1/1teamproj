// src/utils/dbMap.js
export const mapProfileToRow = ({
  userId,
  userName,
  rrnFront,
  rrnBack1,
  userHp,
}) => ({
  username: userId?.trim().toLowerCase(),
  name: userName || null,
  rrn_front: rrnFront || null,
  rrn_tail1: rrnBack1 || null,
  phone: userHp || null,
});

export const mapBusinessToRow = (form, ownerId) => ({
  owner_id: ownerId,
  brand_name: form.comName,
  category: form.bizCat || null,
  owner_name: form.bizOwner || null,
  address: form.comAddr || null,
  phone: form.ceoHp || null,
  region: form.comRegion || null,
});

export const mapStaffToRow = (form, ownerId, businessId) => ({
  owner_id: ownerId,
  business_id: businessId,
  name: form.staffName,
  age: form.staffAge ? Number(form.staffAge) : null,
  hourly_wage: form.wageHour ? Number(form.wageHour) : 0,
  phone: form.staffHp || null,
  gender: form.staffGender || null,
});
