class Post
    if(ENV['DATABASE_URL'])
      uri = URI.parse(ENV['DATABASE_URL'])
      DB = PG.connect(uri.hostname, uri.port, nil, nil, uri.path[1..-1], uri.user, uri.password)
    else
      DB = PG.connect({:host => "localhost", :port => 5432, :dbname => 'contacts_development', :user => 'aaroncontacts', :password => 'contacts17'})
    end

    def self.all
      results = DB.exec("SELECT * FROM contacts ORDER BY last_name, first_name ASC;")

      return results.map do |result|
        {
            "id" => result["id"].to_i,
            "first_name" => result["first_name"],
            "last_name" => result["last_name"],
            "number" => result["number"],
            "address" => result["address"],
            "email" => result["email"],
            "photo" => result["photo"],
            "company" => result["company"]
        }
      end
    end


    def self.find(id)
      results = DB.exec("SELECT * FROM contacts WHERE id = #{id};")
      return {
         "id" => results.first["id"].to_i,
         "first_name" => results.first["first_name"],
         "last_name" => results.first["last_name"],
         "number" => results.first["number"],
         "address" => results.first["address"],
         "email" => results.first["email"],
         "photo" => results.first["photo"],
         "company" => results.first["company"]
      }
    end

    def self.create(opts)
      p opts
      results = DB.exec(
        <<-SQL
          INSERT INTO contacts (first_name, last_name, number, address, email, photo, company)
          VALUES (
             '#{opts["first_name"]}',
             '#{opts["last_name"]}',
             '#{opts["number"]}',
             '#{opts["address"]}',
             '#{opts["email"]}',
             '#{opts["photo"]}',
             '#{opts["company"]}')
          RETURNING id, first_name, last_name, number, address, email, photo, company;
        SQL
      )
      return {
         "id" => results.first["id"].to_i,
         "first_name" => results.first["first_name"],
         "last_name" => results.first["last_name"],
         "number" => results.first["number"],
         "address" => results.first["address"],
         "email" => results.first["email"],
         "photo" => results.first["photo"],
         "company" => results.first["company"]
      }
    end

    def self.delete(id)
      results = DB.exec("DELETE FROM contacts WHERE id=#{id};")
      return { "deleted" => true }
    end

    def self.update(id, opts)
      results = DB.exec(
        <<-SQL
          UPDATE contacts
          SET
            first_name='#{opts["first_name"]}',
            last_name='#{opts["last_name"]}',
            number='#{opts["number"]}',
            address='#{opts["address"]}',
            email='#{opts["email"]}',
            photo='#{opts["photo"]}',
            company='#{opts["company"]}'
          WHERE id = #{id}
          RETURNING id, first_name, last_name, number, address, email, photo, company;
        SQL
      )
      return {
         "id" => results.first["id"].to_i,
         "first_name" => results.first["first_name"],
         "last_name" => results.first["last_name"],
         "number" => results.first["number"],
         "address" => results.first["address"],
         "email" => results.first["email"],
         "photo" => results.first["photo"],
         "company" => results.first["company"]
      }
    end
end
