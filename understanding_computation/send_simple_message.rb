
def send_simple_message
     RestClient.post "https://api:key-7be12dbd7dcbba9587e53c4fd63847ed"\
           "https://api.mailgun.net/v3/nicey.wang/messages",
             :from => "Excited User <excited@samples.mailgun.org>",
               :to => "devs@mailgun.net",
                 :subject => "Hello",
                   :text => "Testing some Mailgun awesomeness!"
end