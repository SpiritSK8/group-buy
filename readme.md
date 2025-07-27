# Team Splitly
Welcome to the GitHub repository of GroupBuy, made by Team Splitly!

# **Proposed LoA: Apollo**

## **Documentation Link**

<a href="https://docs.google.com/document/d/1cttF5rbBtQkVbky5JO6yfPCQLOqBhNUDh47uGJoBU7s">Documentation</a>

## **Video Link**

[Video](https://drive.google.com/file/d/1H-vW9OZ0UfqOsWkLMlz2QYu5TAIYe7KN/view)


## **Poster Link**

[Poster](https://drive.google.com/file/d/1mbOq1f8-N6peU0vuPyjpHRlKOKzSE6sT/view)


## **Log**


[Log](https://docs.google.com/spreadsheets/d/1RErwj-EsBd2x9dToYT63RZ4eAhD36h_VGefUF7tBrvo/edit?usp=sharing) 


## **Short Brief** 

GroupBuy is an app that enables users to collaborate and take advantage of special deals, such as “Buy 2 Get 1 Free” or minimum purchase requirements like $100. This way, users can maximise discounts while minimising unnecessary spending and effort.

## **Detailed Description**

We will define GroupBuy as a coordination to purchase items together to take advantage of a GroupBuy deal (any deal that involves a minimum purchase or purchase of multiple items).

Essentially, The GroupBuy app allows the user to: find a GroupBuy deal, setup a GroupBuy with others, join existing Group Buys, coordinate with other users to GroupBuy together. The typical GroupBuy experience will look like the following:

Upon logging in, users are presented with a list of available GroupBuy deals sourced from our GroupBuy database. Users can browse these deals and select one they wish to participate in by initiating a new GroupBuy. During this setup process, the user provides key details including the preferred shopping location, the time window during which the purchase will take place, and the specific items they intend to contribute to the group order. Once a GroupBuy is created, other users can view and join it to collectively meet the deal requirements. Alternatively, users can browse existing GroupBuys and join ones that match their preferences.

An integrated chat feature exists to facilitate communication, allowing members to coordinate precise meeting times and locations for the purchase. This streamlined process enables users to benefit from discounts through group purchasing, ultimately saving money without the need for excessive individual spending or complicated arrangements.

# Setup Instructions
<strong>Step 1</strong>: Clone this repository using the following command.
```
git clone git@github.com:SpiritSK8/group-buy.git
```

<strong>Step 2</strong>: Open the cloned group-buy folder in VSCode.
```
code <path to cloned folder>
```

<strong>Step 3</strong>: Open the terminal and navigate to `./app`:
```
cd ./app/
```

<strong>Step 4</strong>: Install the required dependencies.
```
npm install
```

The next step is to run the app on Android. You can either use an Android emulator on your computer, or use your own Android device.

### Running the app using Android emulator

<strong>Step 1</strong>: Install an Android emulator. You can install one by following the instructions <a href="https://docs.expo.dev/workflow/android-studio-emulator/">here</a>.

<strong>Step 2</strong>: Run your Android emulator and enable USB debugging. Follow these <a href="https://developer.android.com/studio/debug/dev-options">instructions</a> to enable USB debugging.

<strong>Step 3</strong>: Run the app using the following command (make sure you are in the `./app/` directory).
```
npx expo start -a
```

### Running the app on your Android device

<strong>Step 1</strong>: Install Expo Go from the Play Store in your device.

<strong>Step 2</strong>: Run the app using the following command (make sure you are in the `./app/` directory).
```
npx expo start
```

<strong>Step 3</strong>: Open Expo Go on your device and scan the QR code.

# Scraper Setup Instructions
<strong>Step 1</strong>: Assuming you have cloned this repository and opened the group-buy folder, install the following dependencies using Python:
```
pip install pytest-playwright
pip install bs4
```

<strong>Step 2</strong>: Run the `fairprice_scraper.py`.
```
python ./scraper/fairprice_scraper.py
```

<strong>Step 3</strong>: Wait until the process is finished. A JSON file called `promotions.json` should appear.

<strong>Step 4</strong>: Manually upload these promotions into the app. (Automatic upload will come soon!)

# **Development Plan**

[Development Plan](https://docs.google.com/document/d/1maZlSuMO5eH9s_eOv98VZoKOX-usrKVfspF9CuOwc8E/edit?usp=sharing)
