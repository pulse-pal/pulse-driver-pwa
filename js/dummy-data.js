/* ==========================================================
   PULSEPAL DRIVER — DUMMY-DATA.JS
   Static/dummy data source. No backend calls yet.
   ========================================================== */

const DRIVER = {
  name: "John Mwangi",
  phone: "0712345678",
  plan: "premium",
  plan_expires: "04 Nov 2026",
  auto_renew: true
}

const VEHICLES = [
  {
    id: 1,
    device_code: "PULSE-0001",
    plate: "KBZ 123A",
    make: "Toyota",
    model: "Corolla Axio",
    year: 2018,
    tank_size: 42,
    top_speed: 180,
    active: true,
    status: "active",
    speed: 67,
    rpm: 2100,
    engine_temp: 92,
    fuel_level: 65,
    fuel_litres: 27.3,
    battery: 12.6,
    engine_load: 45,
    location: "Westlands, Nairobi",
    current_road: "Waiyaki Way",
    lat: -1.2676,
    lng: 36.8070,
    fault_codes: ["P0301"],
    distance_today: 47,
    last_updated: "2 seconds ago",
    signal_strength: "strong",
    last_sync: "2 seconds ago",
    firmware_version: "v2.1.4"
  },
  {
    id: 2,
    device_code: "PULSE-0048",
    plate: "KCA 456B",
    make: "Subaru",
    model: "Forester",
    year: 2019,
    tank_size: 60,
    top_speed: 195,
    active: false,
    status: "active",
    speed: 0,
    rpm: 0,
    engine_temp: 25,
    fuel_level: 80,
    fuel_litres: 48,
    battery: 12.4,
    engine_load: 0,
    location: "Kilimani, Nairobi",
    current_road: "Ngong Road",
    lat: -1.2897,
    lng: 36.7856,
    fault_codes: [],
    distance_today: 0,
    last_updated: "5 mins ago",
    signal_strength: "weak",
    last_sync: "5 mins ago",
    firmware_version: "v2.0.9"
  }
]

let ACTIVE_VEHICLE = VEHICLES[0]

// Set by fuel-navigator.frag when a destination is chosen,
// read by map.frag to render the route + fuel zones. Cleared
// when the user exits the route via the X button. Persists
// across navigation to other pages and back.
let ACTIVE_FUEL_ROUTE = null

// Set by trips.frag when VIEW DETAILS is tapped (trip id, number),
// read by trip-detail.frag to look up the trip in TRIPS.
let ACTIVE_TRIP_ID = null

// Set by mechanics.frag when a mechanic card is tapped (mechanic id,
// number), read by mechanic-detail.frag to look up in MECHANICS.
let ACTIVE_MECHANIC_ID = null

// Speed alert preferences, set on speed-alerts.frag. Not yet read
// by map.frag's live alert logic — this is the settings state only.
const SPEED_ALERT_SETTINGS = {
  fixed_cameras: true,
  mobile_cameras: true,
  police_checks: true,
  alert_style: "both",       // "sound" | "vibration" | "both"
  alert_distance: "1km"      // "500m" | "1km" | "2km"
}

// People this vehicle is shared with, managed on vehicle-sharing.frag.
// access_type "full" is available on Starter (vehicle_sharing_basic).
// access_type "timed" (an expiry window) and driving_score (from the
// behavior report) are Premium (vehicle_sharing_advanced) only.
const SHARED_USERS = [
  {
    id: 1,
    name: "Grace Mwangi",
    phone: "0711223344",
    role: "Spouse",
    access_type: "full",
    expires_at: null,
    driving_score: 84,
    added_at: "2 weeks ago"
  },
  {
    id: 2,
    name: "Kevin Otieno",
    phone: "0798877665",
    role: "Employee",
    access_type: "timed",
    expires_at: "Today, 6:00 PM",
    driving_score: 69,
    added_at: "3 days ago"
  }
]

// Devices a technician has installed and pre-linked to vehicle info
// (per the devices table in the DB schema — installed_by staff before
// the customer activates), but not yet claimed by this driver's
// account. add-vehicle.frag searches this pool, mirroring how
// onboarding-device.frag searches VEHICLES during account creation.
// Once claimed, an entry is removed here and pushed into VEHICLES.
const AVAILABLE_DEVICES = [
  {
    device_code: "PULSE-0099",
    plate: "KDD 789C",
    make: "Mazda",
    model: "Demio",
    year: 2020,
    tank_size: 38,
    top_speed: 165
  },
  {
    device_code: "PULSE-0112",
    plate: "KDG 321E",
    make: "Toyota",
    model: "Hilux",
    year: 2021,
    tank_size: 76,
    top_speed: 175
  }
]

// Past payments, shown on subscription.frag. Newest first.
// A new entry is unshifted here after a successful in-app payment.
const PAYMENT_HISTORY = [
  {
    plan_code: "premium",
    plan_name: "Premium",
    amount_kes: 2500,
    duration_months: 1,
    method: "M-Pesa",
    mpesa_ref: "QGH7T2K9LP",
    paid_at: "04 Oct 2026"
  },
  {
    plan_code: "premium",
    plan_name: "Premium",
    amount_kes: 2500,
    duration_months: 1,
    method: "M-Pesa",
    mpesa_ref: "RN3J8Y4XWQ",
    paid_at: "04 Sep 2026"
  },
  {
    plan_code: "starter",
    plan_name: "Starter",
    amount_kes: 1500,
    duration_months: 1,
    method: "M-Pesa",
    mpesa_ref: "MK2P9V6ZTB",
    paid_at: "04 Aug 2026"
  }
]

// App-lock settings, managed on security.frag. This is a demo-level
// simulation (an in-memory PIN check on next app open) — real device
// biometrics (FaceID/fingerprint) aren't reliably available to a PWA
// across the range of phones this app targets.
const SECURITY_SETTINGS = {
  app_lock_enabled: false,
  pin: null
}

// Per-alert-type delivery channel preferences, managed on
// notification-preferences.frag.
const NOTIFICATION_PREFERENCES = {
  fault_alerts: { sms: true, push: true },
  speed_camera_alerts: { sms: false, push: true },
  police_checks: { sms: false, push: true },
  curfew_geofence: { sms: true, push: true }
}

const APP_INFO = {
  app_version: "1.4.2",
  build: "2026.09.29",
  terms_url: "https://pulseafrica.co.ke/terms",
  privacy_url: "https://pulseafrica.co.ke/privacy",
  whatsapp_number: "254712345000"
}

// App-wide theme, set on settings.frag's Theme picker. Only "light"
// is actually implemented — the CSS/pages dark-mode retrofit is a
// deferred, separate pass (see project notes). Selecting "dark" is
// accepted here but shows a "coming soon" toast rather than applying.
let APP_THEME = "light"

const FAULT_CODES = [
  {
    code: "P0301",
    system: "Engine",
    title: "Cylinder 1 Misfire Detected",
    severity: "high",
    can_drive: true,
    description_simple: "Cylinder 1 is misfiring due to incomplete combustion. Likely cause: worn spark plug, weak ignition coil, or a clogged fuel injector. Left unresolved, this raises fuel consumption and risks catalytic converter damage over time.",
    description_technical: "PCM detected misfire on cylinder 1. Check spark plug resistance (10-20kΩ), ignition coil output, fuel injector pulse width, and compression (min 150 PSI).",
    symptoms: "Rough idle or shaking at traffic lights, slight loss of power when accelerating, increased fuel consumption",
    most_likely_cause: "Faulty spark plug (most common cause)",
    cause_note: "This is usually the cheapest fix — typically KES 500–800 per plug.",
    action: "Visit a mechanic within 3 days. Avoid heavy acceleration until fixed.",
    cost_min: 2000,
    cost_max: 8000,
    detected_at: "2 hours ago",
    freeze_frame: {
      speed: 62,
      rpm: 2050,
      engine_temp: 91,
      fuel_level: 68,
      engine_load: 52
    }
  }
]

const FAULT_HISTORY = [
  {
    code: "P0442",
    title: "Evaporative Emission System Leak (Small)",
    detected_at: "3 weeks ago",
    cleared_at: "2 weeks ago"
  },
  {
    code: "P0128",
    title: "Coolant Thermostat Below Regulating Temperature",
    detected_at: "2 months ago",
    cleared_at: "2 months ago"
  }
]

const TRIPS = [
  {
    id: 1,
    date: "Today",
    start: "Westlands",
    end: "CBD Nairobi",
    distance: 8.4,
    duration: "22 mins",
    avg_speed: 34,
    max_speed: 67,
    fuel_used: 0.9,
    score: 82,
    harsh_braking: 1,
    harsh_accel: 0,
    speeding: 0
  },
  {
    id: 2,
    date: "Today",
    start: "CBD Nairobi",
    end: "Thika Road KM 23",
    distance: 23.1,
    duration: "38 mins",
    avg_speed: 67,
    max_speed: 94,
    fuel_used: 2.1,
    score: 74,
    harsh_braking: 2,
    harsh_accel: 1,
    speeding: 1
  },
  {
    id: 3,
    date: "Yesterday",
    start: "Westlands",
    end: "Nakuru",
    distance: 156,
    duration: "2h 10mins",
    avg_speed: 82,
    max_speed: 112,
    fuel_used: 14.1,
    score: 71,
    harsh_braking: 3,
    harsh_accel: 2,
    speeding: 2
  },
  {
    id: 4,
    date: "Yesterday",
    start: "Nakuru",
    end: "Westlands",
    distance: 156,
    duration: "2h 05mins",
    avg_speed: 84,
    max_speed: 108,
    fuel_used: 13.7,
    score: 76,
    harsh_braking: 2,
    harsh_accel: 1,
    speeding: 1
  },
  {
    id: 5,
    date: "2 days ago",
    start: "Westlands",
    end: "JKIA Airport",
    distance: 18.2,
    duration: "45 mins",
    avg_speed: 42,
    max_speed: 78,
    fuel_used: 2.0,
    score: 88,
    harsh_braking: 0,
    harsh_accel: 0,
    speeding: 0
  }
]

const MECHANICS = [
  {
    id: 1,
    name: "James Kamau",
    garage: "Kamau Motors",
    location: "Industrial Area, Nairobi",
    distance: "2.3km away",
    rating: 4.8,
    reviews: 47,
    specializations: ["Toyota", "Nissan", "Subaru"],
    verified: true,
    priority: true,
    phone: "0722345678",
    open: true
  },
  {
    id: 2,
    name: "Peter Njoroge",
    garage: "Pete Auto Garage",
    location: "Westlands, Nairobi",
    distance: "0.8km away",
    rating: 4.5,
    reviews: 23,
    specializations: ["Toyota", "Mazda"],
    verified: true,
    priority: false,
    phone: "0733456789",
    open: true
  },
  {
    id: 3,
    name: "Mary Wanjiru",
    garage: "Wanjiru Auto Works",
    location: "Parklands, Nairobi",
    distance: "3.1km away",
    rating: 4.9,
    reviews: 89,
    specializations: ["BMW", "Mercedes", "Audi"],
    verified: true,
    priority: true,
    phone: "0744567890",
    open: false
  }
]

// due_in_km is the live, numeric distance remaining — decremented
// every simulation tick by app.js as the vehicle "drives". due_in
// is the display string, kept in sync with due_in_km automatically.
// notified_thresholds tracks which km milestones (500/100/0) have
// already fired a notification, so each one only fires once.
const SERVICE_REMINDERS = [
  {
    type: "oil_change",
    title: "Oil Change Due",
    description: "Based on your mileage and last service",
    due_in_km: 800,
    due_in: "800km",
    urgency: "medium",
    estimated_cost: "KES 3,500 - 5,000",
    notified_thresholds: []
  },
  {
    type: "service",
    title: "General Service Due",
    description: "Scheduled every 5,000km",
    due_in_km: 2200,
    due_in: "2,200km",
    urgency: "low",
    estimated_cost: "KES 8,000 - 15,000",
    notified_thresholds: []
  },
  {
    type: "tyre_rotation",
    title: "Tyre Rotation",
    description: "Recommended every 10,000km",
    due_in_km: 4800,
    due_in: "4,800km",
    urgency: "low",
    estimated_cost: "KES 500 - 1,000",
    notified_thresholds: []
  }
]

// Appointments booked via mechanic-detail.frag's date/time picker.
// Purely local/dummy — no backend yet. Each entry: mechanic_id,
// date (display string), time (display string), notes, status.
const BOOKINGS = []

const SPEED_CAMERAS = [
  {
    road: "Thika Road",
    distance: "1.2km ahead",
    speed_limit: 80,
    type: "Fixed Camera",
    lat: -1.2234,
    lng: 36.8456
  },
  {
    road: "Eastern Bypass",
    distance: "3.4km ahead",
    speed_limit: 80,
    type: "Fixed Camera",
    lat: -1.2654,
    lng: 36.9123
  }
]

const COMMUNITY_REPORTS = [
  {
    type: "police_check",
    road: "Waiyaki Way",
    distance: "2.1km ahead",
    reported: "15 mins ago",
    confirmations: 3,
    lat: -1.2678,
    lng: 36.7890
  }
]

const NOTIFICATIONS = [
  {
    type: "fault",
    title: "Fault Detected",
    message: "Cylinder 1 Misfire Detected on KBZ 123A",
    time: "2 hours ago",
    read: false
  },
  {
    type: "payment",
    title: "Payment Confirmed",
    message: "Your Premium plan is now active",
    time: "3 days ago",
    read: true
  },
  {
    type: "welcome",
    title: "Welcome to PulsePal",
    message: "Your device PULSE-0001 is now connected",
    time: "3 days ago",
    read: true
  }
]

const DESTINATIONS = [
  { name: "Thika", distance_km: 45, lat: -1.0333, lng: 37.0693 },
  { name: "Nakuru", distance_km: 156, lat: -0.3031, lng: 36.0800 },
  { name: "Kisumu", distance_km: 265, lat: -0.0917, lng: 34.7680 },
  { name: "Mombasa", distance_km: 485, lat: -4.0435, lng: 39.6682 }
]