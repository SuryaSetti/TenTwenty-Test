  @surya
  Feature: SauceDemo login and navigation

  Background:
    Given I am on the login page

  Scenario Outline: <testcase> - Login and perform an action
    When I login with the credentials of test case "<testcase>"
    Then I should be on the products page
    When I perform the action of test case "<testcase>"
    Then I should see the expected result of test case "<testcase>"

    Examples:
      | testcase | description                                                  |
      | TC01     | standard_user adds Sauce Labs Backpack to the cart           |
      | TC02     | problem_user adds Sauce Labs Bike Light to the cart          |
      | TC03     | performance_glitch_user adds Sauce Labs Onesie to the cart   |
      | TC04     | error_user adds Sauce Labs Backpack to the cart              |
      | TC05     | standard_user sorts products by price low to high            |
      | TC06     | standard_user sorts products by name Z to A                  |
      | TC07     | standard_user logs out and returns to the login page         |

  Scenario Outline: <testcase> - Navigate to each page from the UI as standard_user
    When I login with the credentials of test case "<testcase>"
    Then I should be on the products page
    When I perform the action of test case "<testcase>"
    Then I should see the expected result of test case "<testcase>"

    Examples:
      | testcase | description                                                  |
      | TC08     | Menu > All Items opens the inventory page                    |
      | TC09     | Menu > Dynamic Catalog > Lazy Load opens the lazy load page  |
      | TC10     | Menu > Dynamic Catalog > Spinner opens the spinner page      |
      | TC11     | Menu > Dynamic Catalog > Slider opens the slider page        |
      | TC12     | Menu > About opens the Sauce Labs site                       |
      | TC13     | Menu > Logout opens the login page                           |
      | TC14     | Clicking a product name opens its details page               |

  # @fail: these tests assert the correct behaviour and are expected to fail until the bug is fixed.
  @fail
  Scenario Outline: <testcase> - Known bugs
    When I login with the credentials of test case "<testcase>"
    Then I should be on the products page
    When I perform the action of test case "<testcase>"
    Then I should see the expected result of test case "<testcase>"

    Examples:
      | testcase | description                                                      |
      | TC21     | Inventory: descriptions show raw code text (allTheThings())      |
      | TC22     | Inventory: product names show raw code text (allTheThings())     |
      | TC23     | Lazy Load: same item repeated in different sizes                 |
      | TC24     | Lazy Load: scrolling adds items indefinitely                     |
      | TC25     | Lazy Load: clicking an item does not open its details page       |
      | TC26     | Lazy Load: no add to cart button                                 |
      | TC27     | Slider: no add to cart button                                    |

  Scenario Outline: <testcase> - Login with invalid credentials
    When I login with the credentials of test case "<testcase>"
    Then I should see the expected result of test case "<testcase>"

    Examples:
      | testcase | description                                      |
      | TC15     | Locked out user cannot log in                    |
      | TC16     | Valid user with wrong password cannot log in     |
      | TC17     | Unknown user cannot log in                       |
      | TC18     | Empty username is rejected                       |
      | TC19     | Empty password is rejected                       |
      | TC20     | Username is case sensitive                       |

  Scenario Outline: <testcase> - Complete the checkout and payment flow
    When I login with the credentials of test case "<testcase>"
    And I add the items of test case "<testcase>" to the cart
    And I open the cart of test case "<testcase>"
    And I start the checkout
    And I fill the checkout form of test case "<testcase>" and continue
    Then I should see the order overview of test case "<testcase>"
    When I finish the order
    Then I should see the order confirmation
    When I generate the PDF order
    Then the PDF should contain the details of test case "<testcase>"

    Examples:
      | testcase | description                                              |
      | TC28     | Two items: overview, confirmation and PDF receipt        |
      | TC29     | Single item: overview, confirmation and PDF receipt      |

  Scenario Outline: <testcase> - Checkout form validation
    When I login with the credentials of test case "<testcase>"
    And I add the items of test case "<testcase>" to the cart
    And I open the cart of test case "<testcase>"
    And I start the checkout
    And I fill the checkout form of test case "<testcase>" and continue
    Then I should see the checkout error of test case "<testcase>"

    Examples:
      | testcase | description                         |
      | TC30     | First name is required              |
      | TC31     | Last name is required               |
      | TC32     | Postal code is required             |

  # @fail: asserts the correct behaviour; expected to fail until the bug is fixed.
  @fail
  Scenario Outline: <testcase> - Checkout form accepts invalid input (known bug)
    When I login with the credentials of test case "<testcase>"
    And I add the items of test case "<testcase>" to the cart
    And I open the cart of test case "<testcase>"
    And I start the checkout
    And I fill the checkout form of test case "<testcase>" and continue
    Then I should not be able to proceed with the invalid details

    Examples:
      | testcase | description                                      |
      | TC33     | Numbers accepted in first name and last name     |
      | TC34     | Text accepted in postal code                     |
