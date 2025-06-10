# Team Name: Splitly

# Proposed LoA: Apollo

# Video Link
[Video](https://drive.google.com/file/d/1H-vW9OZ0UfqOsWkLMlz2QYu5TAIYe7KN/view)

# Poster Link
[Poster](https://drive.google.com/file/d/1mbOq1f8-N6peU0vuPyjpHRlKOKzSE6sT/view)

# Log
[Log](https://docs.google.com/spreadsheets/d/1RErwj-EsBd2x9dToYT63RZ4eAhD36h_VGefUF7tBrvo/edit?usp=sharing)
# Project Scope:
## Short Brief
GroupBuy is an app that enables users to collaborate and take advantage of special deals, such as “Buy 2 Get 1 Free” or minimum purchase requirements like $100. This way, users can maximise discounts while minimising unnecessary spending and effort.

## Detailed Description
We will define GroupBuy as a coordination to purchase items together to take advantage of a GroupBuy deal (any deal that involves a minimum purchase or purchase of multiple items).

Essentially, The GroupBuy app allows the user to: find a GroupBuy deal, setup a GroupBuy with others, join existing Group Buys, coordinate with other users to GroupBuy together. The typical GroupBuy experience will look like the following:

Upon logging in, users are presented with a list of available GroupBuy deals sourced from our GroupBuy database. Users can browse these deals and select one they wish to participate in by initiating a new GroupBuy. During this setup process, the user provides key details including the preferred shopping location, the time window during which the purchase will take place, and the specific items they intend to contribute to the group order. Once a GroupBuy is created, other users can view and join it to collectively meet the deal requirements. Alternatively, users can browse existing GroupBuys and join ones that match their preferences.

An integrated chat feature exists to facilitate communication, allowing members to coordinate precise meeting times and locations for the purchase. This streamlined process enables users to benefit from discounts through group purchasing, ultimately saving money without the need for excessive individual spending or complicated arrangements.


# Problem Motivation

When shopping for our daily needs, we often come across promotions like “spend $100 to get 2% off” or “buy 3 get 2 free.” These deals can be frustrating, as they force us to choose between spending more to get a lower unit price or buying less at a higher cost. Either way, we often end up making less-than-ideal decisions.

Often that not, this has made us coordinate within friends to make group purchases, so we can get what we want at cheaper prices. However, this can often be a hassle as we might not find friends that want to make the same purchase as us.

This inspired us to create GroupBuy, a platform that aggregates group-buy deals and helps users coordinate purchases, so they can access the lowest prices without overbuying.

We also want GroupBuy to encourage a mindset of “buy only what you need.” From personal experience, buying in bulk for discounts often leads to waste, as we can’t consume everything we purchase. Thus we want to create this app 

Finally, we believe GroupBuy can make a meaningful social impact. Studies show that lower-income households often pay more per unit for essentials, simply because they can’t afford to buy in bulk. By enabling them to access group deals without upfront bulk spending, our app can help reduce their daily expenses and improve financial fairness.


# Proposed Features

## Core Features

### User Registration Feature
A way for users to register by inputting their email and password or using google. At this stage, users will be asked to input a variety of things such as: preferred shopping locations, preferred shopping times, etc.

### Deal Scraper
The deal scraper is supposed to source and verify existing group buy deals and add it into a database. From research, there are two main types of GroupBuy deals, type 1: minimum purchase for x% off and type 2: Buy x to get y free deals. 

While we have not planned the exact specifics of the mechanism of the scraper, we will likely use some form of visual AI scraper to scrape information of group buy deals from pre-determined websites. The AI scraper will then categorise whether the deal is type 1 or type 2 and then fill in the relevant details such as end date of deal, minimum purchase amount, extra restrictions, etc.

We would like the scraper to be able to quantify the amount of savings (percentage wise or numerically), this is such that we can have a priority system of the largest deals.

### GroupBuy Deals Page

This will the first page that users see after they have registered. This page would have a: near me view, and a top deals view. The near me view would display deals that can be purchased near the user's location. The top deals view would showcase the top deals going on by weighting in the potential discounts, preferred shopping locations and item categories.

### GroupBuy Deal Advanced Search Feature
On top of the GroupBuy deals page, we would also like to have a search bar, where users can filter GroupBuy deals based on: item category, store location, type of deal, etc.

### Create GroupBuy Feature
In the GroupBuy deals page, users can click on the GroupBuy deal to create a GroupBuy that will be posted to other users so that they can GroupBuy together. When creating GroupBuy users are expected to input:
1. User's expected contribution (value of items they want to contribute (type 1 deal) or number of items they want to buy (type 2 deal)
2. Range of dates and timings for GroupBuy
3. Preferred Location of GroupBuy


### Existing GroupBuy Page & Joining Feature
The existing GroupBuy page is the page that all GroupBuys are posted to, here users can look for and join existing GroupBuys.

### GroupBuy MatchMaking Mechanism
If a GroupBuy posted has the same deal, preferred location and has an overlap in the range of date and timings, they will automatically be paired to the same GroupBuy group. Either way, if GroupBuy doesn't have enough people yet, it will still be posted.

### GroupBuy coordination page
A page to manage all existing GroupBuys that you have created or joined. Functions like a chat system with many Groups. Each Group will have a description containing the deal, each user's contribution and ideal range of timings. In other words, it's like a mini telegram group so users can coordinate easily. GroupBuy creator can click "Enough People" to stop any more people from joining the GroupBuy. Users can click "Completed GroupBuy" and once all users clicked it, the GroupBuy group will terminate.


## Extension Features

### User Review Feature
A feature that allows users to leave a review once a GroupBuy is completed. This allows users to leave a numeric review and certain comments to the other user's profile. This is to incentivise people to behave during GroupBuys and not do malicious activities. This also provides a way for users to avoid potentially malicious individuals that don't show up to GroupBuys, don't pay, etc.

### Add Friends Feature
Have the option to add people you GroupBuy'ed with as a friend

### Upload Your Own Deal Feature
Give users the ability to submit a url to be scraped into our database. This would give users much more freedom in the kind of deals they can implement in the system. For this, we would add a manual review system before adding the deal into the database.

### Cost-Splitting Calculator
A calculator that does the math in GroupBuys in accordance of contribution and deal type, such that people don't have to figure out how to split the costs.

#Design

## Overall System Design
after logging in, user will be brought to the home page with navigation bar containing four options: GroupBuy deals page, Existing GroupBuys page, GroupBuy coordination page, and user settings page. More details on each page are listed below:

1. GroupBuy deals page - contains scraped GroupBuy deals, has search bar feature, and gives users the opportunity to create new GroupBuys
2. Existing GroupBuys page - contains existing GroupBuy deals, has search bar feature and gives users the opportunity to join existing GroupBuys
3. GroupBuy coordination page - contains ongoing GroupBuy deals that user is part of, similar to having groups on WhatsApp / Telegram, where each group has information on the GroupBuy deal. This page gives users the opportunity to coordinate with other users to execute their GroupBuys.
4. Users Settings page - Allows users to modify their account preferences / details, potentially allows users to see their own reviews / friends and potentially allows users to submit new GroupBuy deals

### Diagram
[System Diagram](https://viewer.diagrams.net/index.html?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Page-1%22%20id%3D%22pkAHTo9asASW-nNBS-bg%22%3E7Vxbc5s4FP41ntl9SEYgBPgxt7bbabuZzey2fdpRbAWzxcgFnNj761cCiYvkCw1gkWY704k5EkKc852Ljo6YwKvl5m2CV4uPdE6iiQ3mmwm8nti25doe%2B8MpW0GxbFBQgiScC1pFuAv%2FJYIou63DOUkbHTNKoyxcNYkzGsdkljVoOEnoU7PbA42aT13hgGiEuxmOdOrncJ4tCqov34vT35EwWMgnW%2B60aFli2Vm8SbrAc%2FpUI8GbCbxKKM2KX8vNFYk49yRfivve7GktJ5aQOGtzw%2FunzZWPl5%2B%2B%2BxfXX9ef1%2FBvEJ1ZUEwu28o3JnPGAHFJk2xBAxrj6KaiXiZ0Hc8JHxawq6rPB0pXjGgx4j8ky7ZCmnidUUZaZMtItJJNmH2p%2Ff7KhzpH4up6I0bOL7byIs6S7Zf6Re0uflndll%2FJ%2B4r34y%2B1l2%2BClNJ1MiMHmGUL%2FOEkINmBfrCULtMLQpeEzYfdl5AIZ%2BFjcx5Y4DMo%2B1UiZD%2BEFH9AomKSjzhaiyfdsQlnmpgrIXIpPC3CjNytcP7%2BT0yXmwITY5IkI5vDbNRfW97gCD0QlgB64vqpUqvSOCxqKuWCgThlOUawX%2BK4gu7XetvwOIYtcYxM4thCL8UyGZCMY1IyULMw79gzbLBOSZJPIgjTjCRcDG90s7Ogy%2Ft1ehKTA6eKyXF3mBzH1U2OP5jJmZoAdY8AdVoC1DUJUEcD6AcahPEBFwhOgkcXjs0FIo1TfwjtNc4sB8AGs2xomlllID%2BKeAGcLl5wWyq911Hp81svkgRvax1WNIyztDbyLSfUlEox8shTlkFKf8c52J%2F9KGZQ4aR8lQ7Qsf6HzkHo%2BCb9hW1kEWyAyxboyOaTaKhvmdBQI4vBthjoKjKdx2A3j8shCsyJuw4IywJ2cyQXouZIBSq1kfoSnKuFMO%2FYmIxyyzN7fHJsEQI%2B4ccwYAyjLAoEl9h8eKPGgs7UdHgDvVfqo7yW1hMazYd4Gs6vCY7SEuhuxOZ%2Bma5w3JCh%2B33NE8yXM8aY7GxGI5pM4AWfdXCPf2FYYrMByp9fc%2F6CH%2Br8QOPs7AEvw2hb3LKkMU0LDSrb0xwFvBWsNgWdaVB2hqMwiIuGNE9W5k25Ep6JMXhbTIUqVq%2FFfgXFX6TuQiDGXE7NM%2BzllWQ2ytnNKNf8N1c0xPmLuLU40tcq%2B0q4PWsYuxqmEGrZUhgwJCUrexVCLXtJ1eME%2FtyG1eLEnFmcnqsbp1j5Ze25hQVr82ZlU%2FlSlQYgbtXKnrllk8NsK3pu4SS9sHLV6DXOSWtXDVhr44kmSQ9qE1B5nl%2BWjK8Tm3AQ%2FTTcFNrEFLVQKAkyw04D%2BorX9pFhp%2BG%2B1oWN39JpOEZTtb7mNG42YZqFccCob5kcVpfrbeVDTMdEauBvHt6vNSaSkjie6DWa6ZXTrAH8itJkHsYy1h8FsD11BWwc2HK59%2FqALYtIjgJ7ahTYlgbsP4vttduEPoRRtbK9Yxxn9nw0RnyKxoZ1S08RcF5yjl3jDF%2FiVOdausAr%2FnO2jULGvgQe5919wegP9yUBz74FOft%2FX2dsGCLoxSro2kI9eU0loV2WTh1j%2BHC7nIa9ZlvTguzKDN2SJGRvz1Ssd5ODWlocq6srfV52VoWPe4Jsq%2BWbdj8%2BbKDkHLBQ77ATGhomVtssvtniD3dEun3S4r%2B2atw5TfgsNbaV1IBnnWLTRK8fkEnJn8Gz2srWRrlpYsyz2kbsZp9a1IuP09HvNSU1VSUw8CaUrYeYF7%2Fx4HzGwDyCYhpbyaxYwHw1jb6hIRNS3HwwMyKzsPPwUWZgb%2BL80WV2tta019AwLuEoIhENErxkHVc1F95oq%2Fn2YyJ5CDdEHlboS0SKsZm2DeOHk5CRYsXn1kcPHZ7ZbbcJbaPbhNBIQr5HPsO2mcfOrqQbn%2FXM42eS3qfMbPws4Q9UfYZtOvyBeul5nekMldLlvnRvAMfmDOCoDsscSxgP7Qxg24MasGvFXbdCeMO7s8Ms1ntfPTgAngPgOL7tId%2B1gdfQPc9RdKptaZzj2OfT5lj%2BtN265EdX%2Fw7Y%2B6hBEwBQTwD8FZInEcCnGvpMF0y4vnE7qm%2FJvwmj%2FMAFeKDJaDinlsl75s%2BqGM8ZG9qyhNOWzgZ1PYDRDdlTDdkf8Te%2BUYnZ%2Fzi3CtUKf2Tw9ncdDTwpvOWEjMEbQGVLxK0Iw4RZx6OnrsdC9nlLdA6cnpx8HjvU%2FrlNXIHpQA4f7pz%2FgWkq8%2FKHjw5cw5A2tlfktD7H3XUvb7e0kVJv5KF2YWdvgjftqp1G5rBu2gwtGFsjonM93W5E%2BM6ehELPdgkp54os69hhLxkQ77lhGMvk6ImkHYWxkyKPd%2F%2FC83hqrGMB1DLYGSyR5%2BhH9MW6sVaUbDhEVKuRXfMrIDMfa3pp6RwX8mC293SOq%2BwxD5XLUU8GniSRg3SFHGVawnW9czX0Na6X7ovKjfcY1aC2NVGu3VHTu9lNPUv5nvLvwYwnH7ED1%2BZTEshwrd8YUxJomBWbC%2B1z4E6rfz35rNwVNmE1UEZix6OOJSV2zu4EeQmklx7tjv5FudGe0P%2BFbCWr4f%2B0bfQ%2FnF0ZVWGR6b1k1LawyDH6XdHChTdP0azmuKi8GI8fVQtBzQeHZr5jKcFu1aF%2BqIbuzDrFWRiJouHB%2Fiwn5qk1T5b4DOmweXK9eni3P5otcGZ%2BDaaeZjWfGJHf3K4fA17gOP%2F%2BzyohD4S92oyY55x6NnJIzk3Epy5qSK0%2BcgFv%2FgM%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E#%7B%22pageId%22%3A%22pkAHTo9asASW-nNBS-bg%22%7D)

### Sample Screens in Home Page

#### Deals Page
[Deals Page](https://drive.google.com/file/d/1d5_DdumlSiEZUu4OJfxxR60fSQzpHCxQ/view?usp=sharing)

#### Existing GroupBuys page
[Existing GroupBuys Page](https://drive.google.com/file/d/1vmFQWsz1YChWSqqusEK3VdNjZ-BRL8v0/view?usp=sharing)

#### Coordination Page
[Coordination Page](https://drive.google.com/file/d/1xL7Wom2NDxR0cuTWtMa8Ozr4f8A7Spet/view?usp=sharing)

#### User Profile / Settings page
[User Profile / Settings page](https://drive.google.com/file/d/1peEWxT8xeSP4mSa1Pm0bbUUGX7S9y3kV/view?usp=sharing)


## Design Principles


### Single Responsibility Principle (SRP)
We will ensure that each part of our app has a single clear responsibility. For example, the deal scraper will focus solely on gathering and categorising deals, without handling user authentication or chat. This approach will keep our code clean and easier to maintain or extend.

### Open/Closed Principle (OCP)
We will design our deal and cost-splitting components so they can be extended with new deal types without modifying existing code. This will allow us to add features safely, reducing the risk of introducing bugs in core functionality.

### Liskov Substitution Principle (LSP)
We will implement deal types so that any specific deal (such as “minimum purchase” or “buy X get Y”) can be used interchangeably wherever a generic deal interface is expected. This polymorphism will let us write flexible, reusable code for handling deals uniformly.

### Interface Segregation Principle (ISP)
We will break down user-related interfaces to ensure that components depend only on the interfaces they actually use. For example, the chat system will depend only on messaging interfaces rather than the full user profile, keeping dependencies minimal and our code simpler.

### Don’t Repeat Yourself (DRY)
We will avoid duplicating logic—such as input validation or date overlap checks—by centralizing these into shared utilities or services. This will reduce bugs and make future changes more efficient.

### Keep It Simple, Stupid (KISS)
We will prioritize simple, straightforward solutions, especially early on. For example, our matchmaking algorithm will initially rely on basic rules like matching deal types, locations, and overlapping times before considering more complex approaches.

### You Aren’t Gonna Need It (YAGNI)
We will focus first on building essential features such as browsing deals, creating and joining GroupBuys, and chatting. Extension features like reviews or friend lists will be added later once core functionality is implemented.

### Law of Demeter (Least Knowledge)
We will ensure modules only communicate with their direct collaborators. For instance, the GroupBuy coordinator will interact only with the messaging service’s API rather than accessing user or database internals directly, promoting loose coupling and maintainability.

### Modularity
We will build features as separate modules or services—such as deal scraping, matchmaking, chat, and reviews—with clear APIs. This modularity will help us scale, test, and update components independently without impacting the entire system.




## Design Patterns


### Model-View-Controller (MVC)
We will separate the app’s data (model), user interface (view), and business logic (controller or viewmodel). This separation will help us manage complexity, especially for features like deal browsing, GroupBuy creation, and chat coordination, making the app easier to develop and maintain.

### Observer Pattern
We will implement the observer pattern to keep users informed about real-time updates—such as new chat messages or changes in GroupBuy status—without tightly coupling components. This will enable efficient and responsive UI updates.

###Factory Pattern
We will use the factory pattern to create deal objects dynamically based on their type (e.g., minimum purchase or buy X get Y). This design will make it easy to add new deal types in the future without changing the core creation logic.

### Strategy Pattern
We will implement different cost-splitting algorithms as interchangeable strategies. Depending on the deal type, the appropriate calculation method will be selected at runtime, allowing us to easily extend or modify splitting logic.

### Singleton Pattern
We will ensure that services such as database connections or configuration managers are instantiated only once across the app. This singleton pattern will help us maintain consistency and efficient resource usage.

### Repository Pattern
We will abstract data access through repositories for entities like deals, users, and GroupBuys. This abstraction will allow us to swap underlying storage systems or mock data sources for testing without affecting business logic.


# Development Plan
[Development Plan](https://docs.google.com/document/d/1maZlSuMO5eH9s_eOv98VZoKOX-usrKVfspF9CuOwc8E/edit?usp=sharing)

# Setup Instructions
<strong>Step 1</strong>: Clone this repository using the following command.
```
git clone git@github.com:SpiritSK8/group-buy.git
```

<strong>Step 2</strong>: Open the cloned group-buy folder in VSCode

<strong>Step 3</strong>: Make a .env file in this directory, and add the following lines:
```
MONGO_URI = mongodb+srv://\<Your MongoDB URI\>
JWT_SECRET = supersecretkey
```
Please use MongoDB Atlas to create a database and follow the instructions there.

<strong>Step 4</strong>: Run the server using the following command. Make sure you have Node.js installed and have no other process running on port 3000.
```
node ./backend./server.js
```
You should see the following message:
```
Server running on port 3000
MongoDB connected
```
If you don't see "MongoDB connected", then please check your MongoDB setup again.

<strong>Step 5</strong>: Run the app in an Android emulator using the following command. You need to make sure you have an Android emulator available.
```
npx expo start ./app -a
```