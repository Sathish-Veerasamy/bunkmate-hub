// ============================================
// MOCK DATA TOGGLE
// Set to `true` to use hardcoded mock data
// Set to `false` to fetch from API
// ============================================
export const USE_MOCK = true;

// ============================================
// ENTITY METAINFO TYPES
// ============================================
export interface EntityMeta {
  entity: string;
  table_name: string;
  primary_key: string;
  fields: import("@/components/dealers/MetaFormField").FieldMeta[];
}

// ============================================
// DEALER METAINFO
// ============================================
export const DEALER_META: EntityMeta = {
  entity: "dealer",
  table_name: "dealers",
  primary_key: "id",
  fields: [
    { name: "name", type: "string", nullable: false, partial_field: true, display_type: "Single Line", constraints: { max_len: 200, min_len: 2 } },
    { name: "description", type: "multi_line", nullable: true, partial_field: true, display_type: "Multi Line" },
    { name: "phone", type: "phone", nullable: true, partial_field: true, display_type: "Phone" },
    { name: "email", type: "email", nullable: true, partial_field: true, display_type: "Email", constraints: { unique: true } },
    { name: "website", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "rating", type: "decimal", nullable: true, partial_field: true, display_type: "Decimal", constraints: { precision: 5, scale: 2 } },
    { name: "total_orders", type: "number", nullable: true, partial_field: true, display_type: "Number" },
    { name: "is_active", type: "boolean", nullable: false, partial_field: true, display_type: "Checkbox", default: true },
    { name: "registered_date", type: "date", nullable: true, partial_field: true, display_type: "Date Picker" },
    { name: "last_visit", type: "date_time", nullable: true, partial_field: true, display_type: "Date Time Picker" },
    { name: "category", type: "enum", nullable: true, partial_field: true, display_type: "Dropdown", constraints: { values: ["LOCAL", "REGIONAL", "NATIONAL"] } },
    { name: "documents", type: "file", nullable: true, partial_field: false, display_type: "File Upload", constraints: { allowed_types: ["pdf", "jpg", "png"], max_size_mb: 10 } },
    { name: "metadata", type: "json", nullable: true, partial_field: false, display_type: "JSON Editor" },
    { name: "status", type: "ref_entity", collection: false, nullable: false, partial_field: true, display_type: "Dropdown", display_key: "name", relational_mapping: { relationship_type: "MANY_TO_ONE", ref_entity: "status", join_column: "status_id", referenced_column: "id", on_delete: "restrict", fetch: "lazy" } },
    { name: "tasks", type: "ref_entity", collection: true, standalone: true, nullable: true, partial_field: false, display_type: "Child Table", display_key: "title", relational_mapping: { relationship_type: "ONE_TO_MANY", ref_entity: "task", mapped_by: "context_id", context_filter: { context_type: "dealer" }, fetch: "lazy" } },
    { name: "subscriptions", type: "ref_entity", collection: true, standalone: true, nullable: true, partial_field: false, display_type: "Child Table", display_key: "plan_name", relational_mapping: { relationship_type: "ONE_TO_MANY", ref_entity: "subscription", mapped_by: "dealer_id", fetch: "lazy" } },
    { name: "donations", type: "ref_entity", collection: true, standalone: true, nullable: true, partial_field: false, display_type: "Child Table", display_key: "purpose", relational_mapping: { relationship_type: "ONE_TO_MANY", ref_entity: "donation", mapped_by: "dealer_id", fetch: "lazy" } },
    { name: "meetings", type: "ref_entity", collection: true, standalone: true, nullable: true, partial_field: false, display_type: "Child Table", display_key: "title", relational_mapping: { relationship_type: "ONE_TO_MANY", ref_entity: "meeting", mapped_by: "dealer_id", fetch: "lazy" } },
  ],
};

// ============================================
// TASK METAINFO
// ============================================
export const TASK_META: EntityMeta = {
  entity: "task",
  table_name: "tasks",
  primary_key: "id",
  fields: [
    { name: "title", type: "string", nullable: false, partial_field: true, display_type: "Single Line", constraints: { max_len: 300, min_len: 2 } },
    { name: "description", type: "multi_line", nullable: true, partial_field: true, display_type: "Multi Line" },
    { name: "status", type: "enum", nullable: false, partial_field: true, display_type: "Dropdown", constraints: { values: ["Pending", "In Progress", "Completed", "Cancelled"] } },
    { name: "priority", type: "enum", nullable: false, partial_field: true, display_type: "Dropdown", constraints: { values: ["High", "Medium", "Low"] } },
    { name: "assignedTo", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "dueDate", type: "date", nullable: true, partial_field: true, display_type: "Date Picker" },
    { name: "createdAt", type: "date", nullable: true, partial_field: false, display_type: "Date Picker" },
    { name: "notes", type: "multi_line", nullable: true, partial_field: false, display_type: "Multi Line" },
  ],
};

// ============================================
// DONATION METAINFO
// ============================================
export const DONATION_META: EntityMeta = {
  entity: "donation",
  table_name: "donations",
  primary_key: "id",
  fields: [
    { name: "date", type: "date", nullable: false, partial_field: true, display_type: "Date Picker" },
    { name: "purpose", type: "string", nullable: false, partial_field: true, display_type: "Single Line", constraints: { max_len: 300 } },
    { name: "amount", type: "string", nullable: false, partial_field: true, display_type: "Single Line" },
    { name: "mode", type: "enum", nullable: false, partial_field: true, display_type: "Dropdown", constraints: { values: ["Cash", "Cheque", "UPI", "Bank Transfer"] } },
    { name: "receiptNo", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "notes", type: "multi_line", nullable: true, partial_field: false, display_type: "Multi Line" },
  ],
};

// ============================================
// SUBSCRIPTION METAINFO
// ============================================
export const SUBSCRIPTION_META: EntityMeta = {
  entity: "subscription",
  table_name: "subscriptions",
  primary_key: "id",
  fields: [
    { name: "planName", type: "string", nullable: false, partial_field: true, display_type: "Single Line" },
    { name: "startDate", type: "date", nullable: false, partial_field: true, display_type: "Date Picker" },
    { name: "endDate", type: "date", nullable: false, partial_field: true, display_type: "Date Picker" },
    { name: "amount", type: "string", nullable: false, partial_field: true, display_type: "Single Line" },
    { name: "billingCycle", type: "enum", nullable: false, partial_field: true, display_type: "Dropdown", constraints: { values: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"] } },
    { name: "status", type: "enum", nullable: false, partial_field: true, display_type: "Dropdown", constraints: { values: ["Active", "Expired", "Cancelled"] } },
  ],
};

// ============================================
// MEETING METAINFO
// ============================================
export const MEETING_META: EntityMeta = {
  entity: "meeting",
  table_name: "meetings",
  primary_key: "id",
  fields: [
    { name: "title", type: "string", nullable: false, partial_field: true, display_type: "Single Line" },
    { name: "date", type: "date", nullable: false, partial_field: true, display_type: "Date Picker" },
    { name: "venue", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "duration", type: "string", nullable: true, partial_field: true, display_type: "Single Line" },
    { name: "attended", type: "boolean", nullable: false, partial_field: true, display_type: "Checkbox", default: false },
    { name: "notes", type: "multi_line", nullable: true, partial_field: false, display_type: "Multi Line" },
  ],
};

// ============================================
// ENTITY META REGISTRY
// ============================================
const ENTITY_META_MAP: Record<string, EntityMeta> = {
  dealer: DEALER_META,
  task: TASK_META,
  donation: DONATION_META,
  subscription: SUBSCRIPTION_META,
  meeting: MEETING_META,
};

export function getEntityMeta(entityName: string): EntityMeta | null {
  return ENTITY_META_MAP[entityName] ?? null;
}

// ============================================
// REF ENTITY OPTIONS
// ============================================
export const MOCK_STATUSES = [
  { id: 1, name: "Active", code: "ACTIVE", color: "#22c55e" },
  { id: 2, name: "Inactive", code: "INACTIVE", color: "#ef4444" },
  { id: 3, name: "Pending", code: "PENDING", color: "#f59e0b" },
];

const REF_ENTITY_OPTIONS: Record<string, any[]> = {
  status: MOCK_STATUSES,
};

export function getRefEntityOptions(refEntity: string): any[] {
  return REF_ENTITY_OPTIONS[refEntity] ?? [];
}

// ============================================
// DEALER LIST DATA
// ============================================
export const MOCK_DEALERS = [
  {
    id: 1, name: "Rajesh Kumar", description: "Premium fuel dealer in Dindigul",
    phone: "9876543210", email: "rajesh@example.com", website: "https://kumarpetro.in",
    rating: 4.5, total_orders: 320, is_active: true,
    registered_date: "2015-03-10", last_visit: "2024-10-01T10:30:00",
    category: "NATIONAL", status: { id: 1, name: "Active" },
    dealershipName: "Kumar Petroleum Services",
    address: "123 Main Road, Dindigul - 624001", company: "IOC",
    constitution: "Proprietor", gstNo: "33AAAAA1234A1Z5", establishedYear: "2015",
    district: "Dindigul", pincode: "624001",
    emergencyContact: "9876543299", dateOfBirth: "1985-05-15", gender: "M",
    bloodGroup: "O+", education: "B.Com", aadharNumber: "1234 5678 9012",
    officeDetails: "Office: 0451-2345678", otherActivities: "Transport business",
  },
  {
    id: 2, name: "Priya Sharma", description: "Regional fuel distributor",
    phone: "9876543211", email: "priya@example.com", website: "https://sharmafuel.in",
    rating: 4.2, total_orders: 185, is_active: true,
    registered_date: "2018-07-22", last_visit: "2024-09-28T14:00:00",
    category: "REGIONAL", status: { id: 1, name: "Active" },
    dealershipName: "Sharma Fuel Station",
    address: "456 Market Street, Dindigul - 624002", company: "BPC",
    constitution: "Partnership", gstNo: "33BBBBB5678B1Z5", establishedYear: "2018",
    district: "Dindigul", pincode: "624002",
    emergencyContact: "9876543300", dateOfBirth: "1990-11-02", gender: "F",
    bloodGroup: "A+", education: "MBA", aadharNumber: "2345 6789 0123",
  },
  {
    id: 3, name: "Mohammed Ali", description: "Local petro center",
    phone: "9876543212", email: "ali@example.com", website: "",
    rating: 3.8, total_orders: 95, is_active: false,
    registered_date: "2020-01-15", last_visit: "2024-08-15T09:00:00",
    category: "LOCAL", status: { id: 2, name: "Inactive" },
    dealershipName: "Ali Petro Center",
    address: "789 Highway Road, Dindigul - 624003", company: "HPC",
    constitution: "Limited", gstNo: "33CCCCC9012C1Z5", establishedYear: "2020",
    district: "Dindigul", pincode: "624003",
    emergencyContact: "9876543301", dateOfBirth: "1978-06-20", gender: "M",
    bloodGroup: "B+", education: "B.Sc", aadharNumber: "3456 7890 1234",
  },
  {
    id: 4, name: "Lakshmi Devi", description: "Established fuel solutions provider",
    phone: "9876543213", email: "lakshmi@example.com", website: "https://devifuel.in",
    rating: 4.8, total_orders: 450, is_active: true,
    registered_date: "2012-09-05", last_visit: "2024-10-05T16:45:00",
    category: "NATIONAL", status: { id: 1, name: "Active" },
    dealershipName: "Devi Fuel Solutions",
    address: "321 Temple Road, Dindigul - 624004", company: "IOC",
    constitution: "Proprietor", gstNo: "33DDDDD3456D1Z5", establishedYear: "2012",
    district: "Dindigul", pincode: "624004",
    emergencyContact: "9876543302", dateOfBirth: "1982-12-25", gender: "F",
    bloodGroup: "O-", education: "M.Com", aadharNumber: "4567 8901 2345",
  },
  {
    id: 5, name: "Suresh Babu", description: "New regional dealer",
    phone: "9876543214", email: "suresh@example.com", website: "",
    rating: 3.5, total_orders: 42, is_active: true,
    registered_date: "2023-02-14", last_visit: "2024-09-20T11:15:00",
    category: "REGIONAL", status: { id: 3, name: "Pending" },
    dealershipName: "Babu Petro Hub",
    address: "555 Canal Road, Dindigul - 624005", company: "BPC",
    constitution: "Proprietor", gstNo: "33EEEEE7890E1Z5", establishedYear: "2023",
    district: "Dindigul", pincode: "624005",
    emergencyContact: "9876543303", dateOfBirth: "1995-04-10", gender: "M",
    bloodGroup: "AB+", education: "B.E", aadharNumber: "5678 9012 3456",
  },
];

// ============================================
// STANDALONE MOCK DATA: TASKS (flat list)
// ============================================
export const MOCK_ALL_TASKS = [
  { id: 1, title: "Follow up on bulk order", status: "Pending", priority: "High", assignedTo: "Admin", dueDate: "2024-10-15", createdAt: "2024-09-01", context_id: 1, context_type: "dealer" },
  { id: 2, title: "Site inspection for safety audit", status: "Completed", priority: "Medium", assignedTo: "Inspector", dueDate: "2024-09-20", createdAt: "2024-08-15", context_id: 1, context_type: "dealer" },
  { id: 3, title: "Document verification", status: "In Progress", priority: "High", assignedTo: "Admin", dueDate: "2024-11-01", createdAt: "2024-09-10", context_id: 1, context_type: "dealer" },
  { id: 4, title: "Renew trade license", status: "Pending", priority: "Low", assignedTo: "Legal", dueDate: "2024-12-31", createdAt: "2024-10-01", context_id: 1, context_type: "dealer" },
  { id: 5, title: "Update contact details", status: "Completed", priority: "Low", assignedTo: "Admin", dueDate: "2024-08-30", createdAt: "2024-08-20", context_id: 1, context_type: "dealer" },
  { id: 6, title: "Partnership agreement review", status: "In Progress", priority: "High", assignedTo: "Legal", dueDate: "2024-10-30", createdAt: "2024-09-15", context_id: 2, context_type: "dealer" },
  { id: 7, title: "Quarterly performance review", status: "Pending", priority: "Medium", assignedTo: "Manager", dueDate: "2024-11-15", createdAt: "2024-10-01", context_id: 2, context_type: "dealer" },
  { id: 8, title: "Equipment maintenance check", status: "Completed", priority: "Medium", assignedTo: "Technician", dueDate: "2024-09-25", createdAt: "2024-09-05", context_id: 2, context_type: "dealer" },
  { id: 9, title: "Reactivation assessment", status: "Pending", priority: "High", assignedTo: "Manager", dueDate: "2024-11-30", createdAt: "2024-10-05", context_id: 3, context_type: "dealer" },
  { id: 10, title: "Overdue payment collection", status: "In Progress", priority: "High", assignedTo: "Finance", dueDate: "2024-10-20", createdAt: "2024-09-20", context_id: 3, context_type: "dealer" },
  { id: 11, title: "Annual compliance filing", status: "Pending", priority: "High", assignedTo: "Legal", dueDate: "2024-12-15", createdAt: "2024-10-01", context_id: 4, context_type: "dealer" },
  { id: 12, title: "Loyalty program enrollment", status: "Completed", priority: "Low", assignedTo: "Marketing", dueDate: "2024-09-15", createdAt: "2024-08-01", context_id: 4, context_type: "dealer" },
  { id: 13, title: "Tank calibration", status: "In Progress", priority: "Medium", assignedTo: "Technician", dueDate: "2024-11-01", createdAt: "2024-09-25", context_id: 4, context_type: "dealer" },
  { id: 14, title: "Staff training session", status: "Pending", priority: "Medium", assignedTo: "HR", dueDate: "2024-11-20", createdAt: "2024-10-05", context_id: 4, context_type: "dealer" },
  { id: 15, title: "Initial setup verification", status: "In Progress", priority: "High", assignedTo: "Admin", dueDate: "2024-10-25", createdAt: "2024-10-01", context_id: 5, context_type: "dealer" },
  { id: 16, title: "Branding materials delivery", status: "Pending", priority: "Low", assignedTo: "Marketing", dueDate: "2024-11-10", createdAt: "2024-10-05", context_id: 5, context_type: "dealer" },
  { id: 17, title: "Prepare annual budget report", status: "Pending", priority: "High", assignedTo: "Finance", dueDate: "2024-12-01", createdAt: "2024-10-10", context_id: null, context_type: null },
  { id: 18, title: "Update CRM database", status: "In Progress", priority: "Medium", assignedTo: "Admin", dueDate: "2024-10-30", createdAt: "2024-10-08", context_id: null, context_type: null },
  { id: 19, title: "Vendor onboarding process", status: "Completed", priority: "Low", assignedTo: "Procurement", dueDate: "2024-09-30", createdAt: "2024-09-01", context_id: null, context_type: null },
  { id: 20, title: "IT infrastructure audit", status: "Pending", priority: "High", assignedTo: "IT", dueDate: "2024-11-15", createdAt: "2024-10-12", context_id: null, context_type: null },
];

// ============================================
// STANDALONE MOCK DATA: DONATIONS (flat list)
// ============================================
export const MOCK_ALL_DONATIONS = [
  { id: 1, date: "2024-08-15", purpose: "Independence Day Event", amount: "₹10,000", receiptNo: "RCP-001", mode: "UPI", dealer_id: 1 },
  { id: 2, date: "2024-01-26", purpose: "Republic Day Event", amount: "₹8,000", receiptNo: "RCP-002", mode: "Cheque", dealer_id: 1 },
  { id: 3, date: "2023-12-25", purpose: "Christmas Charity", amount: "₹5,000", receiptNo: "RCP-003", mode: "Cash", dealer_id: 1 },
  { id: 4, date: "2024-04-14", purpose: "Tamil New Year Celebration", amount: "₹7,500", receiptNo: "RCP-010", mode: "UPI", dealer_id: 1 },
  { id: 5, date: "2024-08-15", purpose: "Independence Day Event", amount: "₹5,000", receiptNo: "RCP-004", mode: "UPI", dealer_id: 2 },
  { id: 6, date: "2024-03-08", purpose: "Women's Day Program", amount: "₹3,000", receiptNo: "RCP-005", mode: "Cash", dealer_id: 2 },
  { id: 7, date: "2024-08-15", purpose: "Independence Day Event", amount: "₹15,000", receiptNo: "RCP-006", mode: "Cheque", dealer_id: 4 },
  { id: 8, date: "2024-06-05", purpose: "Environment Day Drive", amount: "₹10,000", receiptNo: "RCP-007", mode: "UPI", dealer_id: 4 },
  { id: 9, date: "2024-01-26", purpose: "Republic Day Event", amount: "₹12,000", receiptNo: "RCP-008", mode: "Cheque", dealer_id: 4 },
  { id: 10, date: "2023-11-14", purpose: "Children's Day Program", amount: "₹6,000", receiptNo: "RCP-009", mode: "Cash", dealer_id: 4 },
  { id: 11, date: "2024-09-05", purpose: "Teachers' Day Celebration", amount: "₹4,000", receiptNo: "RCP-011", mode: "UPI", dealer_id: 4 },
  { id: 12, date: "2024-08-15", purpose: "Independence Day Event", amount: "₹2,000", receiptNo: "RCP-012", mode: "Cash", dealer_id: 5 },
];

// ============================================
// SUB-MODULE KEYED DATA (by dealer)
// ============================================
export const MOCK_TASKS: Record<number, any[]> = {};
export const MOCK_SUBSCRIPTIONS: Record<number, any[]> = {
  1: [
    { id: 1, planName: "Premium Plan", startDate: "2024-01-01", endDate: "2024-12-31", amount: "₹12,000", status: "Active", billingCycle: "Yearly" },
    { id: 2, planName: "Basic Plan", startDate: "2023-01-01", endDate: "2023-12-31", amount: "₹6,000", status: "Expired", billingCycle: "Yearly" },
    { id: 3, planName: "SMS Add-on", startDate: "2024-06-01", endDate: "2024-12-31", amount: "₹1,500", status: "Active", billingCycle: "Half-Yearly" },
  ],
  2: [
    { id: 4, planName: "Standard Plan", startDate: "2024-03-01", endDate: "2025-02-28", amount: "₹9,000", status: "Active", billingCycle: "Yearly" },
    { id: 5, planName: "Analytics Add-on", startDate: "2024-03-01", endDate: "2024-08-31", amount: "₹2,000", status: "Expired", billingCycle: "Half-Yearly" },
  ],
  3: [
    { id: 6, planName: "Basic Plan", startDate: "2023-06-01", endDate: "2024-05-31", amount: "₹6,000", status: "Expired", billingCycle: "Yearly" },
  ],
  4: [
    { id: 7, planName: "Enterprise Plan", startDate: "2024-01-01", endDate: "2025-12-31", amount: "₹24,000", status: "Active", billingCycle: "Yearly" },
    { id: 8, planName: "Premium Plan", startDate: "2022-01-01", endDate: "2023-12-31", amount: "₹12,000", status: "Expired", billingCycle: "Yearly" },
    { id: 9, planName: "Support Add-on", startDate: "2024-01-01", endDate: "2024-12-31", amount: "₹3,000", status: "Active", billingCycle: "Yearly" },
  ],
  5: [
    { id: 10, planName: "Starter Plan", startDate: "2024-02-14", endDate: "2025-02-13", amount: "₹4,000", status: "Active", billingCycle: "Yearly" },
  ],
};

export const MOCK_DONATIONS: Record<number, any[]> = {};
export const MOCK_MEETINGS: Record<number, any[]> = {
  1: [
    { id: 1, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: true, duration: "2h", notes: "Discussed annual targets" },
    { id: 2, date: "2024-06-20", title: "Quarterly Review Q2", venue: "Conference Room", attended: true, duration: "1h 30m", notes: "Performance review" },
    { id: 3, date: "2024-03-10", title: "Budget Planning 2024", venue: "Board Room", attended: false, duration: "3h", notes: "Absent due to travel" },
    { id: 4, date: "2024-01-05", title: "New Year Planning", venue: "Main Hall", attended: true, duration: "2h", notes: "Goal setting session" },
    { id: 5, date: "2024-10-01", title: "Safety Compliance Review", venue: "Conference Room", attended: true, duration: "1h", notes: "All checks passed" },
  ],
  2: [
    { id: 6, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: true, duration: "2h", notes: "" },
    { id: 7, date: "2024-06-20", title: "Quarterly Review Q2", venue: "Conference Room", attended: false, duration: "1h 30m", notes: "Sent representative" },
    { id: 8, date: "2024-03-10", title: "Budget Planning 2024", venue: "Board Room", attended: true, duration: "3h", notes: "" },
  ],
  3: [
    { id: 9, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: false, duration: "2h", notes: "Inactive dealer" },
    { id: 10, date: "2024-06-20", title: "Quarterly Review Q2", venue: "Conference Room", attended: false, duration: "1h 30m", notes: "Not attending" },
  ],
  4: [
    { id: 11, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: true, duration: "2h", notes: "Active participant" },
    { id: 12, date: "2024-06-20", title: "Quarterly Review Q2", venue: "Conference Room", attended: true, duration: "1h 30m", notes: "" },
    { id: 13, date: "2024-03-10", title: "Budget Planning 2024", venue: "Board Room", attended: true, duration: "3h", notes: "Key contributor" },
    { id: 14, date: "2024-01-05", title: "New Year Planning", venue: "Main Hall", attended: true, duration: "2h", notes: "" },
    { id: 15, date: "2024-10-01", title: "Safety Compliance Review", venue: "Conference Room", attended: true, duration: "1h", notes: "All clear" },
    { id: 16, date: "2024-07-15", title: "Mid-Year Review", venue: "Board Room", attended: true, duration: "2h", notes: "Exceeded targets" },
  ],
  5: [
    { id: 17, date: "2024-09-15", title: "Annual General Meeting", venue: "Main Hall", attended: true, duration: "2h", notes: "First meeting" },
  ],
};

// ============================================
// HELPER: Get sub-module data by parent ID
// ============================================
export function getMockSubModuleData(subModule: string, parentId: number): any[] {
  switch (subModule) {
    case "tasks":
      return MOCK_ALL_TASKS.filter(t => t.context_id === parentId);
    case "subscriptions":
      return MOCK_SUBSCRIPTIONS[parentId] ?? [];
    case "donations":
      return MOCK_ALL_DONATIONS.filter(d => d.dealer_id === parentId);
    case "meetings":
      return MOCK_MEETINGS[parentId] ?? [];
    default:
      return [];
  }
}

// ============================================
// HELPER: Get all entity records (standalone)
// ============================================
export function getMockEntityList(entityName: string): any[] {
  switch (entityName) {
    case "dealer": return MOCK_DEALERS;
    case "task": return MOCK_ALL_TASKS;
    case "donation": return MOCK_ALL_DONATIONS;
    case "subscription": {
      // Flatten keyed subscriptions
      return Object.values(MOCK_SUBSCRIPTIONS).flat();
    }
    case "meeting": {
      return Object.values(MOCK_MEETINGS).flat();
    }
    default: return [];
  }
}

// ============================================
// HELPER: Get dealer by ID
// ============================================
export function getMockDealerById(id: number) {
  return MOCK_DEALERS.find((d) => d.id === id) ?? null;
}

// ============================================
// HELPER: Get any entity record by ID
// ============================================
export function getMockEntityById(entityName: string, id: string | number): any {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const list = getMockEntityList(entityName);
  return list.find((r: any) => r.id === numId) ?? null;
}
