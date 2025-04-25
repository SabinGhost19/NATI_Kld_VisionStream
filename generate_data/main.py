import random
import json

# Helper functions
def random_name():

    adjectives = [
    "Premium", "Luxury", "Budget", "Professional", "Wireless", "Digital", "Ultra", "Mega", "Super", "Extreme",
    "Portable", "Compact", "Advanced", "Modern", "Elegant", "Classic", "Vintage", "Retro", "Sleek", "Stylish",
    "Smart", "Intelligent", "Innovative", "Eco-Friendly", "Sustainable", "Organic", "Natural", "Handmade", "Artisanal", "Custom",
    "Personalized", "Exclusive", "Limited", "Special", "Signature", "Designer", "Branded", "Original", "Authentic", "Genuine",
    "High-End", "Mid-Range", "Entry-Level", "Affordable", "Economical", "Discounted", "Clearance", "Bargain", "Value", "Essential",
    "Necessary", "Basic", "Fundamental", "Standard", "Deluxe", "Enhanced", "Improved", "Upgraded", "Latest", "Newest",
    "Cutting-Edge", "State-of-the-Art", "Revolutionary", "Groundbreaking", "Bestselling", "Popular", "Trending", "Viral", "Famous", "Renowned",
    "Acclaimed", "Award-Winning", "Recognized", "Respected", "Trusted", "Reliable", "Dependable", "Durable", "Sturdy", "Robust",
    "Heavy-Duty", "Industrial", "Commercial", "Residential", "Domestic", "Household", "Indoor", "Outdoor", "Waterproof", "Weatherproof",
    "Water-Resistant", "Dustproof", "Shockproof", "Scratch-Resistant", "Stain-Resistant", "Non-Stick", "Anti-Bacterial", "Hypoallergenic", "Medical-Grade", "Therapeutic",
    "Ergonomic", "Comfortable", "Adjustable", "Flexible", "Foldable", "Collapsible", "Expandable", "Extendable", "Retractable", "Detachable",
    "Removable", "Interchangeable", "Multipurpose", "Versatile", "Multifunctional", "All-in-One", "Comprehensive", "Complete", "Full", "Total",
    "Universal", "Compatible", "Integrated", "Synchronized", "Connected", "Bluetooth-Enabled", "Wi-Fi-Compatible", "Cloud-Based", "Online", "Offline",
    "Rechargeable", "Solar-Powered", "Battery-Operated", "Electric", "Manual", "Automatic", "Semi-Automatic", "Programmable", "Customizable", "Configurable",
    "High-Performance", "Powerful", "Fast", "Quick", "Rapid", "Speedy", "Efficient", "Effective", "Optimized", "Enhanced",
    "High-Resolution", "High-Definition", "Ultra-HD", "4K", "8K", "Full-HD", "Crystal-Clear", "Sharp", "Vibrant", "Colorful",
    "Bright", "Luminous", "Illuminated", "LED", "OLED", "QLED", "Matte", "Glossy", "Shiny", "Reflective",
    "Transparent", "Opaque", "Dark", "Light", "Lightweight", "Featherweight", "Heavyweight", "Bulky", "Slim", "Thin",
    "Thick", "Wide", "Narrow", "Long", "Short", "Tall", "Small", "Medium", "Large", "Extra-Large",
    "Oversized", "Mini", "Micro", "Nano", "Giant", "Massive", "Huge", "Tiny", "Petite", "Miniature"
]

   
    nouns = [
    # Electronics
    "Smartphone", "Laptop", "Tablet", "Desktop", "Monitor", "Keyboard", "Mouse", "Printer", "Scanner", "Headphones", 
    "Earbuds", "Speaker", "Microphone", "Webcam", "Camera", "Camcorder", "Drone", "Projector", "Television", "SmartTV", 
    "MediaPlayer", "DVDPlayer", "BluRayPlayer", "StreamingBox", "GameConsole", "Controller", "VRHeadset", "ARGlasses", "eReader", "Calculator", 
    "Router", "Modem", "NetworkSwitch", "AccessPoint", "Repeater", "Amplifier", "Receiver", "Subwoofer", "Soundbar", "Equalizer", 
    "Turntable", "CDPlayer", "CassettePlayer", "RadioPlayer", "DAC", "Preamp", "PowerAmplifier", "Tuner", "Server", "NAS", 
    "ExternalHardDrive", "SSD", "USBDrive", "MemoryCard", "GraphicsCard", "CPU", "Motherboard", "RAM", "PowerSupply", "ComputerCase", 
    "CoolingFan", "Heatsink", "LiquidCooler", "ThermalPaste", "ExpansionCard", "DockingStation", "HardDriveEnclosure", "USBHub", "KVMSwitch", "CableOrganizer", 
    "Chromebook", "Ultrabook", "Netbook", "WorkStation", "AllinOne", "MiniPC", "BareboneSystem", "ServerRack", "CableModem", "FiberModem", 
    "Smartwatch", "FitnessTracker", "ActivityBand", "GPSWatch", "RunningWatch", "SportWatch", "BluetoothEarpiece", "WirelessCharger", "ChargingStation", "PowerBank", 
    "BatteryPack", "SolarCharger", "USBCharger", "WallCharger", "CarCharger", "MultiPortCharger", "ChargingCable", "USBCable", "HDMICable", "EthernetCable", 
    "AudioCable", "AuxCable", "DisplayCable", "AdapterCable", "ExtensionCord", "PowerStrip", "SurgeProtector", "UninterruptiblePowerSupply", "Converter", "Inverter", 
    "SmartPlug", "SmartSwitch", "SmartBulb", "SmartLightStrip", "SmartThermostat", "SmartLock", "SmartDoorbell", "SecurityCamera", "DoorbellCamera", "BabyCam", 
    "DashCam", "ActionCamera", "InstantCamera", "FilmCamera", "MirrorlessCamera", "DSLRCamera", "WebCamera", "IPCamera", "HomeSecurity", "MotionSensor", 
    "DoorSensor", "WindowSensor", "SmokeSensor", "CarbonMonoxideDetector", "WaterLeakSensor", "TemperatureSensor", "HumiditySensor", "SmartGarage", "SmartSprinkler", "SmartFridge", 
    
    # Home Appliances
    "Refrigerator", "Freezer", "WineCooler", "MiniRefrigerator", "Dishwasher", "WashingMachine", "Dryer", "WasherDryerCombo", "VacuumCleaner", "RoboticVacuum", 
    "SteamCleaner", "HandheldVacuum", "Microwave", "Oven", "Toaster", "ToasterOven", "AirFryer", "SlowCooker", "Blender", "FoodProcessor", 
    "Mixer", "Juicer", "CoffeeMaker", "EspressoMachine", "CoffeeBeans", "CoffeeGrinder", "ElectricKettle", "WaterDispenser", "WaterFilter", "WaterBottle", 
    "IceMaker", "WaffleMaker", "SandwichMaker", "PaniniPress", "ElectricGrill", "IndoorGrill", "RiceCooper", "MultiCooker", "PressureCooker", "SousVideCooker", 
    "IceCreamMaker", "YogurtMaker", "BreadMaker", "PastaMAker", "FoodDehydrator", "ElectricSkillet", "HotPlate", "Griddle", "DeepFryer", "MeatGrinder", 
    "SausageStuffer", "FoodSlicer", "MandolinSlicer", "VegetableSpiralizer", "EggCooker", "PopcornMaker", "CandyMaker", "ChocolateFountain", "CottonCandyMachine", "IceCrusher", 
    "AirConditioner", "PortableAC", "WindowAC", "SplitAC", "Fan", "CeilingFan", "TowerFan", "BoxFan", "OscillatingFan", "AirCirculator", 
    "AirCooler", "Humidifier", "Dehumidifier", "AirPurifier", "Heater", "SpaceHeater", "InfraredHeater", "OilHeater", "ConvectionHeater", "CeramicHeater", 
    "ElectricFireplace", "ElectricBlanket", "HeatedMattressPad", "HeatedThrow", "MassageChair", "MassageCushion", "FootMassager", "NeckMassager", "BackMassager", "MassageGun", 
    "SewingMachine", "EmbroideryMachine", "SewingKit", "SewingNotions", "IronBoard", "SteamIron", "GarmentSteamer", "FabricShaver", "LintRemover", "ClothesRack", 
    
    # Furniture
    "Sofa", "Loveseat", "Sectional", "Futon", "SleepSofa", "Recliner", "Armchair", "AccentChair", "WingChair", "MassageChair", 
    "OttomanFootstool", "Pouf", "BeanBag", "GamingChair", "OfficeChair", "DeskChair", "ErgoChair", "BarStool", "CounterStool", "DiningChair", 
    "BenchSeat", "StorageBench", "ParkBench", "Glider", "RockingChair", "SwingChair", "HammockChair", "AdirondackChair", "FoldingChair", "StackingChair", 
    "CofeeTable", "EndTable", "SideTable", "ConsoleTable", "NestingTables", "AccentTable", "TVStand", "MediaConsole", "EntertainmentCenter", "Bookcase", 
    "Bookshelf", "DisplayShelf", "WallShelf", "FloatingShelf", "LadderShelf", "StorageCube", "StorageBin", "Dresser", "Chest", "Wardrobe", 
    "Armoire", "Credenza", "Buffet", "Hutch", "ChinaCabinet", "Sideboard", "ServerCart", "BarCart", "TeaCart", "KitchenIsland", 
    "DiningTable", "KitchenTable", "DiningSet", "CardTable", "GameTable", "ConferenceTable", "WritingDesk", "ComputerDesk", "ExecutiveDesk", "StandingDesk", 
    "LShapedDesk", "Workstation", "StudyTable", "DraftingTable", "ConsoleDesk", "VanityTable", "NightStand", "BedsideTable", "Bed", "PlatformBed", 
    "PanelBed", "SleighBed", "Daybed", "BunkBed", "LoftBed", "TrundleBed", "MurphyBed", "AdjustableBed", "Headboard", "Footboard", 
    "BedFrame", "Mattress", "MemoryFoamMattress", "InnerSpringMattress", "LatexMattress", "HybridMattress", "AirMattress", "WaterBed", "MattressTopper", "MattressPad", 
    
    # Home Décor
    "Rug", "AreaRug", "Runner", "Doormat", "Carpet", "FloorMat", "YogaMat", "ExerciseMat", "PlayMat", "BeachMat", 
    "Curtains", "Drapes", "Blinds", "Shades", "WindowFilm", "WindowTreatment", "ValanceScarf", "CurtainRod", "TieBack", "CurtainHook", 
    "Pillow", "ThrowPillow", "FloorPillow", "NeckPillow", "BodyPillow", "Cushion", "Bolster", "LumbarSupport", "PillowForm", "PillowCase", 
    "Comforter", "Duvet", "DuvetCover", "Quilt", "Blanket", "Throw", "Afghan", "Sheets", "PillowCase", "BedSkirt", 
    "Bedspread", "CoverLet", "BedInBagSet", "Canopy", "Wallpaper", "WallDecal", "WallMural", "WallSticker", "WallPanel", "WallDecor", 
    "WallArt", "Canvas", "Poster", "Print", "Painting", "Photograph", "MetalArt", "WoodArt", "Tapestry", "Macrame", 
    "Mirror", "WallMirror", "FloorMirror", "VanityMirror", "AccentMirror", "MirroredFurniture", "Clock", "WallClock", "AlarmClock", "DeskClock", 
    "MantelClock", "GrandfatherClock", "PendulumClock", "CuckooClock", "HourGlass", "Vase", "FlowerPot", "Planter", "TerraSium", "AirPlantHolder", 
    "FlowerArrangement", "ArtificialPlant", "FauxTree", "SucculentArt", "DryFlower", "Candleholder", "CandleStick", "CandleScone", "Lantern", "CandleJar", 
    "ScentedCandle", "Diffuser", "EssentialOil", "AirFreshener", "Incense", "IncenseHolder", "BookEnd", "Sculpture", "Figurine", "Statue", 
    
    # Kitchen
    "Cookware", "PotSet", "SaucePan", "StockPot", "DutchOven", "Wok", "Skillet", "FryingPan", "Griddle", "RoastingPan", 
    "BakingSheet", "MuffinTin", "CakePan", "BakingDish", "PieDish", "CasseroleJar", "Ramekin", "SouffleDish", "TartPan", "BreadPan", 
    "CuttingBoard", "KnifeBlock", "ChefKnife", "SantokuKnife", "ParingKnife", "BreadKnife", "ButcherKnife", "CarvingKnife", "KitchenShears", "KnifeSharpener", 
    "MixingBowl", "CollanderStrainer", "Sieve", "MeasuringCup", "MeasuringSpoon", "KitchenScale", "SaladSpinner", "Grater", "Peeler", "MeatTenderizer", 
    "RollingPin", "PastryBoard", "PastryMat", "CookieCutter", "PastryBrush", "IcingBag", "IcingSpatula", "CakeScraper", "CakeTurntable", "CoolingRack", 
    "Spatula", "Turner", "Ladle", "ServingSpoon", "Whisk", "Tongs", "FoodThermometer", "TimerClock", "OvenMitt", "PotHolder", 
    "Apron", "KitchenTowel", "DishCloth", "TableCloth", "Napkin", "NapkinRing", "Placemat", "CoasterSet", "WineGlass", "Tumbler", 
    "CoffeeMug", "Teacup", "SaucerSet", "DinnerPlate", "SaladPlate", "SoupBowl", "ServingPlatter", "ServingBowl", "GravyBoat", "SugarBowl", 
    "CreamerPitcher", "TeaPot", "CoffeePot", "SaltShaker", "PepperMill", "SpiceRack", "SpiceJar", "OilDispenser", "VinegarCruet", "SauceBottle", 
    "UtensilHolder", "NapkinHolder", "PaperTowelHolder", "SpongeHolder", "DishRack", "SinkCaddy", "TrashCan", "RecycleBin", "CompostBin", "FoodStorageContainer", 
    
    # Clothing and Accessories
    "TShirt", "Polo", "ButtonDownShirt", "Blouse", "Tank", "Tunic", "Sweater", "Cardigan", "SweatShirt", "Hoodie", 
    "Jacket", "Blazer", "Vest", "Coat", "Parka", "Windbreaker", "RainCoat", "Poncho", "Cape", "Shawl", 
    "Jeans", "Chinos", "Khakis", "DressSlacks", "Joggers", "SweatPants", "TrackPants", "Leggings", "Jeggings", "Shorts", 
    "Skirt", "Dress", "Gown", "SundressTunic", "Jumpsuit", "Romper", "BodySuit", "Bikini", "OneSwimsuit", "SwimTrunks", 
    "RashGuard", "WetSuit", "Pajamas", "Nightgown", "Robe", "SlipSuit", "Underwear", "Boxers", "Briefs", "Panties", 
    "Bra", "Camisole", "Slip", "Shapewear", "ThermalUnderwear", "CompressortGarment", "Socks", "Tights", "StockingsHose", "LegWarmers", 
    "Boots", "Booties", "Sneakers", "RunningShoes", "TrainingShoes", "WalkingShoes", "DressShoes", "Loafers", "Oxfords", "Sandals", 
    "FlipFlops", "Slippers", "BoatShoes", "EspadrilleShoes", "Clogs", "Moccasins", "WadingBoots", "WinterBoots", "RainBoots", "HikingBoots", 
    "Hat", "Cap", "Beanie", "Beret", "SunHat", "FedoraTrilby", "Bucket", "Visor", "HeadWrap", "Headband", 
    "Scarf", "NeckWarmer", "Bandana", "Gloves", "Mittens", "WristWarmers", "Belt", "Suspenders", "Tie", "BowTie", 
    "Wallet", "CardHolder", "MoneyClip", "KeyChain", "Purse", "Handbag", "Tote", "Backpack", "Duffel", "MessengerBag", 
    "LaptopBag", "BriefCase", "Suitcase", "LuggageSet", "TravelBackpack", "GarmentBag", "ToiletryBag", "MakeupBag", "JewelryRoll", "Wristlet", 
    "Necklace", "Pendant", "Locket", "Chain", "Choker", "Bracelet", "CuffBracelet", "Bangle", "WatchBand", "AnkleBracelet", 
    "Ring", "EngagementRing", "WeddingBand", "Earrings", "StudEarrings", "HoopEarrings", "DropEarrings", "EarCuffs", "Brooch", "Pin", 
    
    # Beauty and Personal Care
    "Shampoo", "Conditioner", "HairMask", "LeaveInConditioner", "HairOil", "HeatProtectant", "HairSerum", "HairSpray", "StylingGel", "StylingMousse", 
    "DrySampoo", "HairDye", "HairBleach", "HairToner", "HairBlowDryer", "HairStraightener", "CurlingIron", "CurlingWand", "HotRollers", "HairCrimper", 
    "HairBrush", "Comb", "HairTies", "HairClips", "HairPins", "Headband", "HairExtensions", "Wig", "FaceCleaner", "FaceWash", 
    "Toner", "ExfoliatingMask", "ClayMask", "SheetMask", "FaceScrub", "EyeCream", "Moisturizer", "Serum", "FaceOil", "Sunscreen", 
    "AfterSun", "Bronzer", "TintedMoisturizer", "BBCream", "CCCream", "Foundation", "Primer", "Concealer", "SettingPowder", "SettingSpray", 
    "Blush", "Highlighter", "Contour", "Eyeshadow", "EyelinerPencil", "LiquidEyeliner", "GelEyeliner", "Mascara", "EyebrowPencil", "BrowGel", 
    "BrowPomade", "BrowKit", "EyelashCurler", "FakeLashes", "LashGlue", "LashSerum", "LipBalm", "LipLiner", "Lipstick", "LiquidLipstick", 
    "LipGloss", "LipTint", "LipPlumper", "LipScrub", "LipMask", "MakeupPalette", "MakeupBrushSet", "MakeupSponge", "MakeupRemover", "CottonPads", 
    "MicellarWater", "CleansingBallm", "MakeupWipes", "Soap", "BodyWash", "ShowerGel", "BathBomb", "BubbleBath", "BathSalt", "BodyOil", 
    "BodyLotion", "BodyButter", "HandCream", "FootCream", "Deodorant", "Antiperspirant", "BodySpray", "Perfume", "Cologne", "BodyPowder", 
    "ShavingCream", "ShavingGel", "Razor", "RazorBlades", "ElectricRazor", "Aftershave", "ShavingBrush", "ShavingBowl", "Trimmer", "EpilatorWaxingKit", 
    "WaxStrips", "SugaringPaste", "HairRemovalCream", "Tweezer", "Toothbrush", "ElectricToothbrush", "ToothbrushHeads", "Toothpaste", "Floss", "MouthWash", 
    "TongueCleaner", "DentalWaterJet", "TeethWhiteningKit", "WhiteningStrips", "ToothpowderGel", "OralIrrigator", "DentureCleaner", "NailClippers", "NailFile", "Cuticle", 
    "NailPolish", "BaseCoat", "TopCoat", "NailStrengthener", "AcrylicKit", "GelPolish", "UVLamp", "NailArtTools", "NailStickers", "NailPolishRemover", 
    
    # Sports and Outdoors
    "TreadMill", "EllipticalMachine", "ExerciseBike", "RowingMachine", "StepMill", "ClimbingMachine", "MultiFunctionalGym", "WeightBench", "PowerRack", "SmithMachine", 
    "Dumbbells", "Kettlebell", "WeightPlate", "BarbellSet", "ResistanceBand", "JumpRope", "FoamRoller", "YogaMat", "YogaBlock", "YogaStrap", 
    "MedicineBall", "StabilityBall", "BalanceBoard", "AbRoller", "PullUpBar", "PushUpHandles", "GripStrengthener", "BoxingGloves", "PunchingBag", "SpeedBag", 
    "HandWraps", "MouthGuard", "JumpingPlatform", "AgilityLadder", "SpeedCones", "BattleRope", "WeightedVest", "AnkleWeights", "WristWeights", "SlantBoard",
    "Bicycle", "MountainBike", "RoadBike", "HybridBike", "ElectricBike", "FoldingBike", "BMX", "BikeHelmet", "BikeLock", "BikeLight",
    "CyclingGloves", "CyclingShorts", "BikePump", "BikeBottleCage", "BicycleBell", "BikeBasket", "BikePannier", "BikeComputer", "CyclingShoes", "SpinningShoes",
    "TennisBall", "TennisRacket", "TennisBag", "TennisNet", "TennisShoes", "BadmintonRacket", "BadmintonBirdie", "BadmintonNet", "GolfClub", "GolfBag",
    "GolfBalls", "GolfTees", "GolfGlove", "PuttingMat", "BowlingBall", "BowlingShoes", "BowlingPin", "BasketBall", "FootBall", "SoccerBall",
    "VolleyBall", "BaseBall", "BaseBallBat", "BaseBallGlove", "SoftBall", "RugbyBall", "Frisbee", "DiscGolf", "TableTennis", "PingPongBall",
    "PingPongPaddle", "HockeyStick", "HockeyPuck", "Field", "LacrosseStick", "LacrosseBall", "CroquetSet", "BocceBall", "HorseshoeSet", "JaiAlaiCesta"
]

    
    return f"{random.choice(adjectives)} {random.choice(nouns)}"

def random_price():
    return round(random.uniform(10.0, 1000.0), 2)

def random_quantity():
    return random.randint(1, 100)

products = []
for id in range(1, 100001):
    product = {
        "id": id,
        "name": random_name(),
        "price": random_price(),
        "quantity": random_quantity()
    }
    products.append(product)

print(f"Generated {len(products)} products")
print("Sample of first 3 products:")
for product in products[:3]:
    print(product)

file_path = "products.json"
with open(file_path, "w") as f:
    json.dump(products, f, indent=2)

print(f"\nProducts saved to {file_path}")