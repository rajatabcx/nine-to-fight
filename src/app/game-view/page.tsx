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
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { gameData } from "@/lib/gameData";
import { GameScenario } from "@/lib/types";
import { NODE_HEIGHT } from "@/lib/constants";

// Custom node component for questions
const QuestionNode = ({
  data,
}: {
  data: {
    id: string;
    title: string;
    description: string;
    questionNumber: number;
  };
}) => (
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
    <Handle
      type="source"
      id={`${data?.id}`}
      position={Position.Bottom}
      className="opacity-0 !pointer-events-none -translate-y-[50%] top-[50%]"
    />
    <Handle
      type="target"
      id={`${data?.id}`}
      position={Position.Top}
      className="opacity-0 !pointer-events-none -translate-y-[50%] top-[50%]"
    />
  </div>
);

// Custom node component for options
const OptionNode = ({
  data,
}: {
  data: {
    id: string;
    text: string;
    consequences: {
      sanity?: number;
      performance?: number;
      money?: number;
      message: string;
      nextScenarioId?: string;
    };
  };
}) => (
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
      &quot;
      {data.consequences.message.length > 80
        ? `${data.consequences.message.substring(0, 80)}...`
        : data.consequences.message}
      &quot;
    </div>
    {data.consequences.nextScenarioId && (
      <div className="text-xs text-green-600 mt-1">
        → Next: {data.consequences.nextScenarioId}
      </div>
    )}
    <Handle
      type="source"
      id={`${data?.id}`}
      position={Position.Bottom}
      className="opacity-0 !pointer-events-none -translate-y-[50%] top-[50%]"
    />
    <Handle
      type="target"
      id={`${data?.id}`}
      position={Position.Top}
      className="opacity-0 !pointer-events-none -translate-y-[50%] top-[50%]"
    />
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
    const questionSpacing = 700; // Vertical spacing between question levels
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
        const optionY = questionY + 300; // Options below questions

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

        // Connect question to option (removed sourceHandle and targetHandle)
        edges.push({
          id: `edge-question-${scenario.id}-to-option-${choice.id}`,
          source: `question-${scenario.id}`,
          sourceHandle: scenario.id,
          targetHandle: choice.id,
          target: optionNodeId,
          type: "smoothstep",
          animated: true,
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

    // Second pass: Connect options to their next questions
    gameData.forEach((scenario: GameScenario) => {
      scenario.choices.forEach((choice) => {
        const optionNodeId = `option-${scenario.id}-${choice.id}`;
        const nextScenarioId = choice.consequences.nextScenarioId;

        // Find if the next scenario exists in our data
        const nextScenario = gameData.find((s) => s.id === nextScenarioId);
        if (nextScenario) {
          const nextQuestionNodeId = `question-${nextScenarioId}`;

          // Connect option to next question
          edges.push({
            id: `edge-option-${choice.id}-to-question-${nextScenarioId}`,
            source: optionNodeId,
            target: nextQuestionNodeId,
            type: "smoothstep",
            animated: true,
            style: {
              stroke: "#10b981",
              strokeWidth: 3,
              strokeDasharray: "8,4",
            },

            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#10b981",
            },
          });
        } else {
          // If no next question exists, create an end node
          const endNodeId = `end-${scenario.id}-${choice.id}`;
          const optionPosition = nodes.find(
            (n) => n.id === optionNodeId
          )?.position;

          if (optionPosition) {
            nodes.push({
              id: endNodeId,
              position: { x: optionPosition.x, y: optionPosition.y + 250 },
              data: { label: "END BRANCH" },
              style: {
                background: "#fca5a5",
                border: "2px solid #ef4444",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#dc2626",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              },
            });

            edges.push({
              id: `edge-option-${choice.id}-to-end`,
              source: optionNodeId,
              target: endNodeId,
              type: "smoothstep",
              style: {
                stroke: "#ef4444",
                strokeWidth: 3,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#ef4444",
              },
            });
          }
        }
      });
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
