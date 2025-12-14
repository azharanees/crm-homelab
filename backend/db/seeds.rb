# Create demo users
rep_user = User.create!(
  email: "rep@wingmate.test",
  password: "password123",
  password_confirmation: "password123",
  name: "Sarah Chen",
  role: "rep"
)

manager_user = User.create!(
  email: "manager@wingmate.test",
  password: "password123",
  password_confirmation: "password123",
  name: "Alex Rodriguez",
  role: "manager"
)

# Companies and leads data
companies = [
  { name: "Acme Corp", contact: "John Smith", email: "john@acme.com", phone: "555-0101" },
  { name: "TechFlow Inc", contact: "Maria Garcia", email: "maria@techflow.com", phone: "555-0102" },
  { name: "CloudScale Ltd", contact: "David Kim", email: "david@cloudscale.com", phone: "555-0103" },
  { name: "DataVault Systems", contact: "Lisa Johnson", email: "lisa@datavault.com", phone: "555-0104" },
  { name: "FinTech Global", contact: "Robert Wilson", email: "robert@fintechglobal.com", phone: "555-0105" },
  { name: "SecureNet Solutions", contact: "Emma Davis", email: "emma@securenet.com", phone: "555-0106" },
  { name: "AI Innovations", contact: "James Brown", email: "james@aiinnovations.com", phone: "555-0107" },
  { name: "Cloud Nine Hosting", contact: "Sarah Miller", email: "sarah@cloudnine.com", phone: "555-0108" },
  { name: "Enterprise Digital", contact: "Michael Chen", email: "michael@entdigital.com", phone: "555-0109" },
  { name: "SaaS Pioneers", contact: "Jessica Lee", email: "jessica@saaspioneers.com", phone: "555-0110" }
]

statuses = ["pending", "contacted", "qualified", "won", "lost"]
sources = ["referral", "cold_call", "inbound", "other"]

# Create leads for rep user (5 leads)
5.times do |i|
  company = companies[i]
  Lead.create!(
    title: "Opportunity at #{company[:name]}",
    company: company[:name],
    contact_name: company[:contact],
    email: company[:email],
    phone: company[:phone],
    status: statuses.sample,
    source: sources.sample,
    owner: rep_user,
    address: "#{100 + i} Main Street, San Francisco, CA",
    latitude: 37.7749 + (i * 0.001),
    longitude: -122.4194 + (i * 0.001),
    description: "Potential client for Q4 expansion. Strong market fit."
  )
end

# Create leads for manager user (5 leads)
5.times do |i|
  company = companies[5 + i]
  Lead.create!(
    title: "Opportunity at #{company[:name]}",
    company: company[:name],
    contact_name: company[:contact],
    email: company[:email],
    phone: company[:phone],
    status: statuses.sample,
    source: sources.sample,
    owner: manager_user,
    address: "#{200 + i} Tech Avenue, New York, NY",
    latitude: 40.7128 + (i * 0.001),
    longitude: -74.0060 + (i * 0.001),
    description: "Enterprise opportunity. Multiple stakeholders involved."
  )
end

# Create tasks (2 per lead)
Lead.all.each do |lead|
  2.times do
    Task.create!(
      title: "Follow up with #{lead.contact_name}",
      due_date: rand(0..14).days.from_now,
      status: rand > 0.5 ? "open" : "completed",
      user: lead.owner,
      lead: lead
    )
  end
end

# Create notes (3 per lead)
Lead.all.each do |lead|
  3.times do
    Note.create!(
      body: [
        "Had initial call. Positive response to demo. Waiting for internal approval.",
        "Sent proposal. Expecting feedback by end of week.",
        "Follow-up call scheduled for next Tuesday at 2 PM.",
        "Competitor mentioned. Need to emphasize our unique features.",
        "Budget approved. Moving to final negotiation stage."
      ].sample,
      user: [rep_user, manager_user].sample,
      lead: lead
    )
  end
end

puts "✓ Created 2 users"
puts "✓ Created 10 leads"
puts "✓ Created 20 tasks"
puts "✓ Created 30 notes"
