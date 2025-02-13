export interface useForm {
  nama: string;
  email: string;
  nomor: string | number;
  gender: string;
  kesibukan: string;
  paket: string;
  kategoriPaket: string;
  duration: string;
  grade: string;
  cabang: string;
  isGrade: number;
  periode: string;
  lokasijemput: string;
  kendaraan: string;
  penumpang: string;
  diskon: string;
  diskonPersen: number;
  diskonNominal: number;
  pembayaran: number;
  pembayaranCourse: number;
  pembayaranGrade: number;
  pembayaranPenjemputan: number;
  biayaAdmin: number;
  metode_pembayaran: string;
  rating: number;
  feedback: string;
  tos: boolean;
  cs: string;
  cs_id: string;
  [key: string]: string | number | boolean | { value: string; label: string };
}

export interface BranchQuery {
  education: string | null;
}

export interface PeriodeQuery {
  education: string | null;
  branch: string | null;
}

export interface Course {
  course_id: number;
  name: string;
  price: number;
  duration: number;
  duration_name: string;
  description: string;
  category_id: string;
}

export interface CourseSelect {
  label: string;
  value: string;
  course: Course;
}

export interface CourseQuery {
  branch_code: string;
  education_code: string;
  periode_id: string;
  category_id: string;
  gender: string;
}

export interface Grade {
  id: number;
  name: string;
  price: number;
  desc: string;
}

export interface GradeSelect {
  label: string;
  value: string;
  grade: Grade;
}

export interface GradeQuery {
  branch_code: string | null;
  course_id: number | null;
  periode_id: string | null;
}

export interface CourseCategoryQuery {
  branch_code: string;
  education_code: string;
  periode_id: string;
  gender: string;
}
export interface CourseCategory {
  id: number;
  name: string;
  course_id: number;
}

export interface CourseCategoryStore {
  label: string;
  value: string;
  course_id: string;
}

export interface Periode {
  id: number;
  periode: string;
  date: string;
  month: string;
  year: string;
  status: string;
}

export interface Branch{
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface BranchSelectProps{
  label: string;
  value: string;
}

export interface Education{
  id: number;
  code: string;
  jenjang: string;
}

export interface EducationSelectProps{
  label: string;
  value: string;
}

export interface PeriodeSelectProps{
  label: string;
  value: string;
}

export interface CalculatePrice{
  grade_id: number;
  course_id: number;
  grade_price: number;
  course_price: number;
}

export interface Pickup{
  id: number;
  pickup_code: string;
  pickup_name: string;
}

export interface PickupSelect{
  label: string;
  value: string;
  pickup: Pickup
}
export interface PickupQuery {
  location_code: string;
}

export interface PickupLocation {
  id: string;
  location_code: string;
  location_name: string;
}

export interface PickupLocationSelect {
  label: string;
  value: string;
  PickupLocation: PickupLocation;
}

export interface Passenger{
  id: number;
  passenger: string;
  price: string;
}

export interface PassengerSelect{
  label: string;
  value: string;
  passenger: Passenger;
}

export interface PassengerQuery{
  pickup: string | null;
  location: string | null;
}

export interface Voucher{
  code: string;
  discount: number;
  description: string;
}

export interface VoucherQuery {
  voucher_code: string | null;
  course_id: number | null;
}

export interface RegistarationResult {
  id: number;
  regcode: string;
  nis: string;
  branch: string;
  name: string;
  gender: string;
  birthplace: string;
  birthplace_id: string;
  birthplace_type: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  subdistrict: string;
  subdistrict_id: string;
  city: string;
  city_type: string;
  city_id: string;
  province: string;
  province_id: string;
  education: string;
  tshirt: string;
  parent_phone: string;
  periode_date: number;
  periode_month: number;
  periode_year: number;
  periode: string;
  course: string;
  course_name: string;
  course_duration: number;
  course_cost: string;
  course_bpp: number;
  admin_fee: number;
  voucher: string;
  discount_percent: string;
  discount_nominal: string;
  discount_total: string;
  down_payment: string;
  down_payment_due_date: string;
  camp: string;
  pickup: string;
  pickupLocation: string;
  passenger: number;
  final_payment: string;
  full_payment: string;
  courseStartDate: string;
  courseEndDate: string;
  pickup_cost: string;
  pickupTime: string;
  ac_room: number;
  ac_room_cost: string;
  checkin_time: string;
  idcard: string;
  tagname: string;
  idCardPic: string;
  studentPic: string;
  pt_grammar: string;
  pt_speaking: string;
  placement_test: string;
  main_class: string;
  camp_class: string;
  status: string;
  lead: string;
  aff: string;
  cs: string;
  origin: string;
  rombongan: number;
  updated_by: string;
  created_at: string;
  updated_at: string;
  know_lc_from_where: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  is_retention: number;
}

export interface Feedback {
  id_member: number;
  rating: number;
  feedback: string;
}