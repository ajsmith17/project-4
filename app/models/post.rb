class Person
    if(ENV['DATABASE_URL'])
      uri = URI.parse(ENV['DATABASE_URL'])
      DB = PG.connect(uri.hostname, uri.port, nil, nil, uri.path[1..-1], uri.user, uri.password)
    else
      DB = PG.connect({:host => "localhost", :port => 5432, :dbname => 'contacts_development', :user => "aaroncontacts", :password => "contacts17"})
    end
    def self.all
      results = DB.exec("SELECT * FROM people;")

      return results.map do |result|
        {
          "id" => result["id"].to_i,
          "name" => result["name"],
          "age" => result["age"].to_i
        }
      end
    end


    def self.find(id)
      results = DB.exec("SELECT * FROM people WHERE id = #{id};")
      return {
        "id" => results.first["id"].to_i,
        "name" => results.first["name"],
        "age" => results.first["age"].to_i
      }
    end

    def self.create(opts)
      results = DB.exec(
        <<-SQL
          INSERT INTO people (name, age)
          VALUES ('#{opts["name"]}', #{opts["age"]})
          RETURNING id, name, age;
        SQL
      )
      return {
        "id" => results.first["id"].to_i,
        "name" => results.first["name"],
        "age" => results.first["age"].to_i
      }
    end

    def self.delete(id)
      results = DB.exec("DELETE FROM people WHERE id=#{id};")
      return { "deleted" => true }
    end

    def self.update(id, opts)
      results = DB.exec(
        <<-SQL
          UPDATE people
          SET name='#{opts["name"]}', age=#{opts["age"]}
          WHERE id = #{id}
          RETURNING id, name, age;
        SQL
      )
      return {
        "id" => results.first["id"].to_i,
        "name" => results.first["name"],
        "age" => results.first["age"].to_i
      }
    end
end
