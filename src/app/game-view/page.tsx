"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { gameData } from "@/lib/gameData";
import { GameScenario } from "@/lib/types";
import { NODE_HEIGHT } from "@/lib/constants";

// Custom node component for questions
const QuestionNode = ({ data }: { data: any }) => (
  <div
    className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 min-w-[300px] max-w-[400px] shadow-lg"
    style={{ height: `${NODE_HEIGHT}px` }}
  >
    <div className="font-bold text-lg mb-2 text-blue-800">
      Q{data.questionNumber}: {data.title}
    </div>
    <div className="text-sm text-gray-700 mb-2">
      {data.description.length > 100
        ? `${data.description.substring(0, 100)}...`
        : data.description}
    </div>
    <div className="text-xs text-blue-600">ID: {data.id}</div>
  </div>
);

// Custom node component for options
const OptionNode = ({ data }: { data: any }) => (
  <div
    className="bg-green-100 border-2 border-green-500 rounded-lg p-3 min-w-[250px] max-w-[350px] shadow-lg"
    style={{ height: `${NODE_HEIGHT}px` }}
  >
    <div className="font-semibold text-green-800 mb-2">Option: {data.text}</div>
    <div className="text-xs text-gray-600 mb-2">
      <strong>Consequences:</strong>
    </div>
    <div className="text-xs space-y-1">
      {data.consequences.sanity && (
        <div>
          Sanity: {data.consequences.sanity > 0 ? "+" : ""}
          {data.consequences.sanity}
        </div>
      )}
      {data.consequences.performance && (
        <div>
          Performance: {data.consequences.performance > 0 ? "+" : ""}
          {data.consequences.performance}
        </div>
      )}
      {data.consequences.money && (
        <div>
          Money: {data.consequences.money > 0 ? "+" : ""}
          {data.consequences.money}
        </div>
      )}
    </div>
    <div className="text-xs text-gray-700 mt-2 italic">
      "
      {data.consequences.message.length > 80
        ? `${data.consequences.message.substring(0, 80)}...`
        : data.consequences.message}
      "
    </div>
    {data.consequences.nextScenarioId && (
      <div className="text-xs text-green-600 mt-1">
        → Next: {data.consequences.nextScenarioId}
      </div>
    )}
  </div>
);

// Node types
const nodeTypes = {
  question: QuestionNode,
  option: OptionNode,
};

export default function GameViewPage() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let yPosition = 0;
    const questionSpacing = 500; // Vertical spacing between question levels
    const optionSpacing = 500; // Horizontal spacing between options

    // Create a map to track question positions for connecting to next questions
    const questionPositions: { [key: string]: { x: number; y: number } } = {};

    gameData.forEach((scenario: GameScenario, scenarioIndex) => {
      const questionX = 0; // Center questions
      const questionY = yPosition;

      // Store question position for later reference
      questionPositions[scenario.id] = { x: questionX, y: questionY };

      // Create question node
      nodes.push({
        id: `question-${scenario.id}`,
        type: "question",
        position: { x: questionX, y: questionY },
        data: {
          id: scenario.id,
          title: scenario.title,
          description: scenario.description,
          questionNumber: scenario.questionNumber,
        },
      });

      // Create option nodes and connect them to the question
      scenario.choices.forEach((choice, choiceIndex) => {
        const optionX =
          questionX -
          ((scenario.choices.length - 1) * optionSpacing) / 2 +
          choiceIndex * optionSpacing;
        const optionY = questionY + 200; // Options below questions

        const optionNodeId = `option-${scenario.id}-${choice.id}`;

        // Create option node
        nodes.push({
          id: optionNodeId,
          type: "option",
          position: { x: optionX, y: optionY },
          data: {
            id: choice.id,
            text: choice.text,
            consequences: choice.consequences,
          },
        });

        // Connect question to option
        edges.push({
          id: `edge-question-${scenario.id}-to-option-${choice.id}`,
          source: `question-${scenario.id}`,
          target: optionNodeId,
          type: "smoothstep",
          animated: true,
          sourceHandle: `question-${scenario.id}`,
          targetHandle: `option-${scenario.id}-${choice.id}`,
          style: {
            stroke: "#3b82f6",
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3b82f6",
          },
        });
      });

      yPosition += questionSpacing;
    });

    return { nodes, edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Exit Interview Game Flow
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Blue nodes are questions, green nodes are options. Dashed lines show
          question flow, solid lines show option connections.
        </p>
      </div>

      <div className="w-full h-[calc(100vh-80px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{
            padding: 50,
            includeHiddenNodes: false,
          }}
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
        >
          <Background color="#f3f4f6" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Legend moved to bottom right */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md text-xs border">
        <div className="font-semibold mb-2">Legend:</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded shadow-sm"></div>
            <span>Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded shadow-sm"></div>
            <span>Options</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-500 rounded shadow-sm"></div>
            <span>End Branches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-blue-500 rounded"></div>
            <span>Question → Option</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-1 bg-green-500 rounded"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #10b981 0px, #10b981 4px, transparent 4px, transparent 8px)",
              }}
            ></div>
            <span>Option → Next Question</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-red-500 rounded"></div>
            <span>Option → End</span>
          </div>
        </div>
      </div>
    </div>
  );
}
