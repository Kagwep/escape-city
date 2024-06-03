import {
    AdvancedDynamicTexture,
    TextBlock,
    Rectangle,
    Control,
    StackPanel,
    Image
} from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

export class GameUI {
    private _scene: Scene;
    private _uiTexture: AdvancedDynamicTexture;
    private _distanceText: TextBlock = new TextBlock;
    private _lifeBarInner: Rectangle = new Rectangle;
    private _enemiesText: TextBlock = new TextBlock;
    private _runawayText: TextBlock = new TextBlock;
    private _elapsedTimeText: TextBlock = new TextBlock;

    constructor(scene: Scene) {
        this._scene = scene;
        this._uiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._createUI();
    }

    private _createUI(): void {
        // Add background image
        const backgroundImage = new Image("background", "./path/to/your/background-image.png");
        backgroundImage.stretch = Image.STRETCH_UNIFORM;
        backgroundImage.width = "100%";
        backgroundImage.height = "100%";
        this._uiTexture.addControl(backgroundImage);

        const topPanel = new StackPanel();
        topPanel.width = "250px";
        topPanel.isVertical = true;
        topPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        topPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        topPanel.paddingTop = "10px";
        topPanel.paddingLeft = "10px";
        this._uiTexture.addControl(topPanel);

        // Distance Covered
        const distancePanel = new Rectangle();
        distancePanel.width = 1;
        distancePanel.height = "30px";
        distancePanel.cornerRadius = 5;
        distancePanel.color = "white";
        distancePanel.thickness = 2;
        distancePanel.background = "#FF5733";
        topPanel.addControl(distancePanel);

        const distanceText = new TextBlock();
        distanceText.text = "Distance Covered: 0m";
        distanceText.color = "white";
        distanceText.fontSize = 14;
        distancePanel.addControl(distanceText);
        this._distanceText = distanceText;

        // Life Bar
        const lifeBarPanel = new Rectangle();
        lifeBarPanel.width = 1;
        lifeBarPanel.height = "35px";
        lifeBarPanel.cornerRadius = 5;
        lifeBarPanel.color = "white";
        lifeBarPanel.thickness = 2;
        lifeBarPanel.background = "#000000ws";
        lifeBarPanel.paddingTop = "10px";
        topPanel.addControl(lifeBarPanel);

        const lifeBarInner = new Rectangle();
        lifeBarInner.width = "0%";
        lifeBarInner.height = "33px"; // lifeBarPanel.height - (lifeBarPanel.thickness * 2)
        lifeBarInner.thickness = 0;
        lifeBarInner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        lifeBarInner.isVisible = true;
        lifeBarPanel.addControl(lifeBarInner);
        this._lifeBarInner = lifeBarInner;

        // Number of Enemies
        const enemiesPanel = new Rectangle();
        enemiesPanel.width = 1;
        enemiesPanel.height = "30px";
        enemiesPanel.cornerRadius = 5;
        enemiesPanel.color = "white";
        enemiesPanel.thickness = 2;
        enemiesPanel.background = "#3357FF";
        enemiesPanel.paddingTop = "10px";
        topPanel.addControl(enemiesPanel);

        const enemiesText = new TextBlock();
        enemiesText.text = "Enemies: 0";
        enemiesText.color = "white";
        enemiesText.fontSize = 14;
        enemiesPanel.addControl(enemiesText);
        this._enemiesText = enemiesText;

        // Runaway Status
        const runawayPanel = new Rectangle();
        runawayPanel.width = 1;
        runawayPanel.height = "30px";
        runawayPanel.cornerRadius = 5;
        runawayPanel.color = "white";
        runawayPanel.thickness = 2;
        runawayPanel.background = "#FF33A6";
        runawayPanel.paddingTop = "10px";
        topPanel.addControl(runawayPanel);

        const runawayText = new TextBlock();
        runawayText.text = "Runaway: No";
        runawayText.color = "white";
        runawayText.fontSize = 14;
        runawayPanel.addControl(runawayText);
        this._runawayText = runawayText;

        // Elapsed Time
        const elapsedTimePanel = new Rectangle();
        elapsedTimePanel.width = 1;
        elapsedTimePanel.height = "30px";
        elapsedTimePanel.cornerRadius = 5;
        elapsedTimePanel.color = "white";
        elapsedTimePanel.thickness = 2;
        elapsedTimePanel.background = "#33dFA6";
        elapsedTimePanel.paddingTop = "10px";
        topPanel.addControl(elapsedTimePanel);

        const elapsedTimeText = new TextBlock();
        elapsedTimeText.text = "Elapsed Time: 0s";
        elapsedTimeText.color = "white";
        elapsedTimeText.fontSize = 14;
        elapsedTimePanel.addControl(elapsedTimeText);
        this._elapsedTimeText = elapsedTimeText;
    }

    // Methods to update the UI
    public updateDistance(distance: number): void {
        this._distanceText.text = `Distance Covered: ${distance}m`;
    }

    public updateLifeBar(value: number): void {
        this._lifeBarInner.width = `${value * 100}%`;

        if (value <= 0.25) {
            this._lifeBarInner.background = "red";
        } else if (value <= 0.75) {
            this._lifeBarInner.background = "blue";
        } else {
            this._lifeBarInner.background = "green";
        }
    }

    public updateEnemiesCount(count: number): void {
        this._enemiesText.text = `Enemies: ${count}`;
    }

    public updateRunawayStatus(status: boolean): void {
        this._runawayText.text = `Runaway: ${status ? "Yes" : "No"}`;
    }

    public updateElapsedTime(time: number): void {
        this._elapsedTimeText.text = `Elapsed Time: ${time}s`;
    }
}
