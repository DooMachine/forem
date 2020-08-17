# rubocop:disable Rails/Output

return if Rails.env.production?

# NOTE: when adding new data, please use this class to ensure the seed tasks
# stays idempotent.
class Seeder
  def initialize
    @counter = 0
  end

  def create_if_none(klass, count = nil)
    @counter += 1
    plural = klass.name.pluralize

    if klass.none?
      message = ["Creating", count, plural].compact.join(" ")
      puts "  #{@counter}. #{message}."
      yield
    else
      puts "  #{@counter}. #{plural} already exist. Skipping."
    end
  end
end

# we use this to be able to increase the size of the seeded DB at will
# eg.: `SEEDS_MULTIPLIER=2 rails db:seed` would double the amount of data
seeder = Seeder.new
SEEDS_MULTIPLIER = [1, ENV["SEEDS_MULTIPLIER"].to_i].max
puts "Seeding with multiplication factor: #{SEEDS_MULTIPLIER}\n\n"

##############################################################################

seeder.create_if_none(Organization) do
  3.times do
    Organization.create!(
      name: Faker::TvShows::SiliconValley.company,
      summary: Faker::Company.bs,
      remote_profile_image_url: logo = Faker::Company.logo,
      nav_image: logo,
      url: Faker::Internet.url,
      slug: "org#{rand(10_000)}",
      github_username: "org#{rand(10_000)}",
      twitter_username: "org#{rand(10_000)}",
      bg_color_hex: Faker::Color.hex_color,
      text_color_hex: Faker::Color.hex_color,
    )
  end
end

##############################################################################

num_users = 10 * SEEDS_MULTIPLIER

users_in_random_order = seeder.create_if_none(User, num_users) do
  roles = %i[trusted chatroom_beta_tester workshop_pass]

  num_users.times do |i|
    name = Faker::Name.unique.name

    user = User.create!(
      name: name,
      summary: Faker::Lorem.paragraph_by_chars(number: 199, supplemental: false),
      profile_image: File.open(Rails.root.join("app/assets/images/#{rand(1..40)}.png")),
      website_url: Faker::Internet.url,
      twitter_username: Faker::Internet.username(specifier: name),
      email_comment_notifications: false,
      email_follower_notifications: false,
      # Emails limited to 50 characters
      email: Faker::Internet.email(name: name, separators: "+", domain: Faker::Internet.domain_word.first(20)),
      confirmed_at: Time.current,
      password: "password",
      password_confirmation: "password",
    )

    if i.zero?
      user.add_role(:trusted) # guarantee at least one moderator
    elsif i == num_users - 1
      next # guarantee at least one user with no role
    else
      role_index = rand(0..roles.length)
      user.add_role(roles[role_index]) if role_index != roles.length # increases chance of more no-role users
    end

    Identity.create!(
      provider: "twitter",
      uid: i.to_s,
      token: i.to_s,
      secret: i.to_s,
      user: user,
      auth_data_dump: {
        "extra" => {
          "raw_info" => { "lang" => "en" }
        },
        "info" => { "nickname" => user.username }
      },
    )
  end

  Organization.find_each do |organization|
    admins = []
    admin_id = User.where.not(id: admins).order(Arel.sql("RANDOM()")).first.id

    OrganizationMembership.create!(
      user_id: admin_id,
      organization_id: organization.id,
      type_of_user: "admin",
    )

    admins << admin_id

    2.times do
      OrganizationMembership.create!(
        user_id: User.where.not(id: OrganizationMembership.pluck(:user_id)).order(Arel.sql("RANDOM()")).first.id,
        organization_id: organization.id,
        type_of_user: "member",
      )
    end
  end

  User.order(Arel.sql("RANDOM()"))
end

##############################################################################

seeder.create_if_none(Tag) do
  tags = %w[yenibaşlayanlar kariyer bilgisayarbilimi git go
            java javascript linux verimlilik python güvenlik web c c++ algoritmalar]

  tags.each do |tag_name|
    Tag.create!(
      name: tag_name,
      bg_color_hex: Faker::Color.hex_color,
      text_color_hex: Faker::Color.hex_color,
      supported: true,
    )
  end
end

##############################################################################

num_articles = 25 * SEEDS_MULTIPLIER

seeder.create_if_none(Article, num_articles) do
  num_articles.times do |i|
    tags = []
    tags << "discuss" if (i % 3).zero?
    tags.concat Tag.order(Arel.sql("RANDOM()")).limit(3).pluck(:name)

    markdown = <<~MARKDOWN
      ---
      title:  #{Faker::Book.title} #{Faker::Lorem.sentence(word_count: 2).chomp('.')}
      published: true
      cover_image: #{Faker::Company.logo}
      tags: #{tags.join(', ')}
      ---

      #{Faker::Hipster.paragraph(sentence_count: 2)}
      #{Faker::Markdown.random}
      #{Faker::Hipster.paragraph(sentence_count: 2)}
    MARKDOWN

    Article.create!(
      body_markdown: markdown,
      featured: true,
      show_comments: true,
      user_id: User.order(Arel.sql("RANDOM()")).first.id,
    )
  end
end

##############################################################################

num_comments = 30 * SEEDS_MULTIPLIER

seeder.create_if_none(Comment, num_comments) do
  num_comments.times do
    attributes = {
      body_markdown: Faker::Hipster.paragraph(sentence_count: 1),
      user_id: User.order(Arel.sql("RANDOM()")).first.id,
      commentable_id: Article.order(Arel.sql("RANDOM()")).first.id,
      commentable_type: "Article"
    }

    Comment.create!(attributes)
  end
end

##############################################################################

seeder.create_if_none(Podcast) do
  image_file = Rails.root.join("spec/support/fixtures/images/image1.jpeg")

  podcast_objects = [
    {
      title: "CodeNewbie",
      description: "",
      feed_url: "http://feeds.codenewbie.org/cnpodcast.xml",
      itunes_url: "https://itunes.apple.com/us/podcast/codenewbie/id919219256",
      slug: "codenewbie",
      twitter_username: "CodeNewbies",
      website_url: "https://www.codenewbie.org/podcast",
      main_color_hex: "2faa4a",
      overcast_url: "https://overcast.fm/itunes919219256/codenewbie",
      android_url: "https://subscribeonandroid.com/feeds.podtrac.com/q8s8ba9YtM6r",
      image: Rack::Test::UploadedFile.new(image_file, "image/jpeg"),
      published: true
    },
    {
      title: "CodingBlocks",
      description: "",
      feed_url: "http://feeds.podtrac.com/c8yBGHRafqhz",
      slug: "codingblocks",
      twitter_username: "CodingBlocks",
      website_url: "http://codingblocks.net",
      main_color_hex: "111111",
      overcast_url: "https://overcast.fm/itunes769189585/coding-blocks",
      android_url: "http://subscribeonandroid.com/feeds.podtrac.com/c8yBGHRafqhz",
      image: Rack::Test::UploadedFile.new(image_file, "image/jpeg"),
      published: true
    },
    {
      title: "Python GÜNDEMİ",
      description: "",
      feed_url: "https://talkpython.fm/episodes/rss",
      slug: "talkpython",
      twitter_username: "TalkPython",
      website_url: "https://talkpython.fm",
      main_color_hex: "181a1c",
      overcast_url: "https://overcast.fm/itunes979020229/talk-python-to-me",
      android_url: "https://subscribeonandroid.com/talkpython.fm/episodes/rss",
      image: Rack::Test::UploadedFile.new(image_file, "image/jpeg"),
      published: true
    },
  ]

  podcast_objects.each do |attributes|
    podcast = Podcast.create!(attributes)
    Podcasts::GetEpisodesWorker.perform_async(podcast_id: podcast.id)
  end
end
##############################################################################

seeder.create_if_none(Broadcast) do
  broadcast_messages = {
    set_up_profile: "DEVLOBI'ye hoş geldiniz! 👋 Ben Lobbi, topluluk maskotuyum ve başlamanıza yardımcı olmak için buradayım. " \
      "<a href='/settings'> Profilinizi oluşturarak </a> başlayalım!",
    welcome_thread: "Burada tekrar SONLANDIR! 👋 DEVLOBI dost canlısı bir topluluktur. " \
      "Neden <a href='/welcome'> hoş geldiniz başlığına </a> bir yorum bırakarak kendinizi tanıtmıyorsunuz!",
    twitter_connect: "Twitter hesabın var mı? " \
      "Twitter hesabınızı <a href='/settings'>bağlarsanız</a> profilinizi etiketleyerek twitter " \
      "sayfamızda paylaşabiliriz <a href='https://twitter.com/devlobicom'>@devlobicom</a>.",
    github_connect: "Lobbi geldi! 🎉  GitHub hesabınız var mı? " \
      "Repolarınızdan herhangi birini profilinize sabitleyebilmek için hesaınızı <a href='/settings'> bağlamalısınız </a>.",
    customize_feed: "Merhaba, yine ben! 👋 Artık DEVLOBI topluluğunun bir parçası olduğunuza göre, içeriğinizi kişiselleştirmeye odaklanalım. " \
      "Anasayfanız'ı özelleştirmeye yardımcı olması için <a href='/tags'> bazı etiketleri takip ederek </a> başlayabilirsiniz!🎉",
    customize_experience: "Lobbi geldi! 👋 DEVLOBI deneyiminizi özelleştirebileceğinizi biliyor muydunuz?? " \
      "<a href='settings/ux'> Yazı tipinizi ve temanızı </a> değiştirmeyi deneyin ve sizin için en iyi stili bulun!",
    start_discussion: "Lobbi geldi! 👋 Farkettim ki " \
      "<a href='https://DEVLOBI.to/t/discuss'>tartışma başlat</a>mamışsınız. Hemen başlatmak için; " \
      "etiket sayfasının kenar çubuğundaki "Gönderi ekle" yi tıklamanız yeterli!",
    ask_question: "Lobbi geldi! 👋 Farkettim ki" \
      "<a href='https://DEVLOBI.to/t/explainlikeimfive'>soru sor</a>mamışsınız. Hemen sormak için; " \
      "etiket sayfasının kenar çubuğundaki "Gönderi ekle" yi tıklamanız yeterli!",
    discuss_and_ask: "Lobbi geldi! 👋 Farkettim ki " \
      "<a href='https://DEVLOBI.to/t/explainlikeimfive'>soru sor</a>mamışsınız veya " \
      "<a href='https://DEVLOBI.to/t/discuss'>tartışma başlat</a>mamışsınız. Bunların ikisini de yapmak çok kolay; " \
      "etiket sayfasının kenar çubuğundaki "Gönderi ekle" yi tıklamanız yeterli!",
    download_app: "Lobbi geldi! 👋, mobil aplikasyonlar yakında sizlerle olacak!"
  }

  broadcast_messages.each do |type, message|
    Broadcast.create!(
      title: "Welcome Notification: #{type}",
      processed_html: message,
      type_of: "Welcome",
      active: true,
    )
  end

  welcome_thread_content = <<~HEREDOC
    ---
    title: Tanışma Partisi - v0
    published: true
    description: Kendinizi tanıtın!
    tags: tanışma
    ---

    Selam! #{ApplicationConfig['COMMUNITY_NAME']}'ye hoşgeldin!

    Kendinizi tanıtmak için aşağıya bir yorum bırakın!✌️
  HEREDOC

  Article.create!(
    body_markdown: welcome_thread_content,
    user: User.DEVLOBI_account || User.first,
  )
end

##############################################################################

seeder.create_if_none(ChatChannel) do
  %w[Workshop Meta General].each do |chan|
    ChatChannel.create!(
      channel_name: chan,
      channel_type: "open",
      slug: chan,
    )
  end

  direct_channel = ChatChannel.create_with_users(users: User.last(2), channel_type: "direct")
  Message.create!(
    chat_channel: direct_channel,
    user: User.last,
    message_markdown: "This is **awesome**",
  )
end

##############################################################################

seeder.create_if_none(HtmlVariant) do
  HtmlVariant.create!(
    name: rand(100).to_s,
    group: "badge_landing_page",
    html: rand(1000).to_s,
    success_rate: 0,
    published: true,
    approved: true,
    user_id: User.first.id,
  )
end

##############################################################################

seeder.create_if_none(Badge) do
  5.times do
    Badge.create!(
      title: "#{Faker::Lorem.word} #{rand(100)}",
      description: Faker::Lorem.sentence,
      badge_image: File.open(Rails.root.join("app/assets/images/#{rand(1..40)}.png")),
    )
  end

  users_in_random_order.limit(10).each do |user|
    user.badge_achievements.create!(
      badge: Badge.order(Arel.sql("RANDOM()")).limit(1).take,
      rewarding_context_message_markdown: Faker::Markdown.random,
    )
  end
end

##############################################################################

seeder.create_if_none(FeedbackMessage) do
  mod = User.first

  FeedbackMessage.create!(
    reporter: User.last,
    feedback_type: "spam",
    message: Faker::Lorem.sentence,
    category: "spam",
    status: "Open",
  )

  FeedbackMessage.create!(
    reporter: mod,
    feedback_type: "abuse-reports",
    message: Faker::Lorem.sentence,
    reported_url: "example.com",
    category: "harassment",
    status: "Open",
  )

  Reaction.create!(
    category: "vomit",
    reactable_id: User.last.id,
    reactable_type: "User",
    user_id: mod.id,
  )

  3.times do
    Reaction.create!(
      category: "vomit",
      reactable_id: Article.order(Arel.sql("RANDOM()")).first.id,
      reactable_type: "Article",
      user_id: mod.id,
    )
  end
end

##############################################################################

seeder.create_if_none(ListingCategory) do
  categories = [
    {
      slug: "sfp",
      cost: 1,
      name: "Konferans SFP",
      rules: "Currently open for proposals, with link to form."
    },
    {
      slug: "eğitim",
      cost: 1,
      name: "Eğitim/Kurslar",
      rules: "Eğitim materyali ve/veya okullar/eğitim kampları."
    },
    {
      slug: "işilanları",
      cost: 25,
      name: "İş İlanları",
      rules: "Şu anda istihdam sunan şirketler."
    },
    {
      slug: "satılık",
      cost: 1,
      name: "Satılık Eşya",
      rules: "Personally owned physical items for sale."
    },
    {
      slug: "etkinlikler",
      cost: 1,
      name: "Yaklaşan Etkinlikler",
      rules: "Yüz yüze veya tarih içeren çevrimiçi etkinlikler."
    },
    {
      slug: "diğer",
      cost: 1,
      name: "Diğer",
      rules: "Başka hiçbir kategoriye uymamalıdır."
    },
  ].freeze

  categories.each { |attributes| ListingCategory.create(attributes) }
end

##############################################################################

seeder.create_if_none(Listing) do
  users_in_random_order = User.order(Arel.sql("RANDOM()"))
  users_in_random_order.each { |user| Credit.add_to(user, rand(100)) }
  users = users_in_random_order.to_a

  listings_categories = ListingCategory.ids
  listings_categories.each.with_index(1) do |category_id, index|
    # rotate users if they are less than the categories
    user = users.at(index % users.length)
    2.times do
      Listing.create!(
        user: user,
        title: Faker::Lorem.sentence,
        body_markdown: Faker::Markdown.random,
        location: Faker::Address.city,
        organization_id: user.organizations.first&.id,
        listing_category_id: category_id,
        contact_via_connect: true,
        published: true,
        bumped_at: Time.current,
        tag_list: Tag.order(Arel.sql("RANDOM()")).first(2).pluck(:name),
      )
    end
  end
end

##############################################################################

seeder.create_if_none(Page) do
  5.times do
    Page.create!(
      title: Faker::Hacker.say_something_smart,
      body_markdown: Faker::Markdown.random,
      slug: Faker::Internet.slug,
      description: Faker::Books::Dune.quote,
      template: %w[contained full_within_layout].sample,
    )
  end
end

##############################################################################

seeder.create_if_none(ProfileField) do
  ProfileFields::AddBaseFields.call
  ProfileFields::AddLinkFields.call
  ProfileFields::AddWorkFields.call
  coding_fields_csv = Rails.root.join("lib/data/coding_profile_fields.csv")
  ProfileFields::ImportFromCsv.call(coding_fields_csv)
  ProfileFields::AddBrandingFields.call
end

##############################################################################

puts <<-ASCII

  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````
  `````````     888                   888          888      d8b`````````````` 
  `````````     888                   888          888      Y8P`````````````` 
  `````````     888                   888          888         `````````````` 
  ````````` .d88888  .d88b.  888  888 888  .d88b.  88888b.  888`````````````` 
  `````````d88" 888 d8P  Y8b 888  888 888 d88""88b 888 "88b 888`````````````` 
  `````````888  888 88888888 Y88  88P 888 888  888 888  888 888`````````````` 
  `````````Y88b 888 Y8b.      Y8bd8P  888 Y88..88P 888 d88P 888`````````````` 
  ````````` "Y88888  "Y8888    Y88P   888  "Y88P"  88888P"  888`````````````` 
  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````
  ```````````````````````````````````````````````````````````````````````````

  Hepsi tamam!
ASCII

# rubocop:enable Rails/Output
