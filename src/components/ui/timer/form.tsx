"use client";

import { useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NumericFormat, PatternFormat } from "react-number-format";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { useTabataStore } from "@/store/tabata";

const FormSchema = z.object({
  number_of_sets: z.number().or(z.string()),
  rounds_per_set: z.number().or(z.string()),
  rest_time: z.string(),
  time_on: z.string(),
  time_off: z.string(),
});

const formatTime = (time: string): string => {
  const [minutes, seconds] = time.split(":").map((str) => parseInt(str, 10));
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export function TabataForm() {
  const { config, setConfig, isRunning, setIsRunning, setIsSettingsOpened } =
    useTabataStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      number_of_sets: config.sets,
      rounds_per_set: config.roundsPerSet,
      time_on: formatTime(config.timeOn),
      time_off: formatTime(config.timeOff),
      rest_time: formatTime(config.restBetweenSets),
    },
    reValidateMode: "onChange",
  });

  useEffect(() => {
    form.reset({
      number_of_sets: config.sets,
      rounds_per_set: config.roundsPerSet,
      time_on: formatTime(config.timeOn),
      time_off: formatTime(config.timeOff),
      rest_time: formatTime(config.restBetweenSets),
    });
  }, [config, form]);

  const handleBlur = (name: keyof z.infer<typeof FormSchema>) => {
    const formValues = form.getValues();
    let updatedValue: string | number;

    switch (name) {
      case "number_of_sets":
        updatedValue = Number(formValues.number_of_sets);
        setConfig({ ...config, sets: updatedValue });
        break;
      case "rounds_per_set":
        updatedValue = Number(formValues.rounds_per_set);
        setConfig({ ...config, roundsPerSet: updatedValue });
        break;
      case "time_on":
        updatedValue = formValues.time_on;
        setConfig({ ...config, timeOn: updatedValue });
        break;
      case "time_off":
        updatedValue = formValues.time_off;
        setConfig({ ...config, timeOff: updatedValue });
        break;
      case "rest_time":
        updatedValue = formValues.rest_time;
        setConfig({ ...config, restBetweenSets: updatedValue });
        break;
    }
  };

  const parseTime = (time: string) => {
    if (!time || time.length < 4) return 0;
    const minutes = parseInt(time.slice(0, -2), 10);
    const seconds = parseInt(time.slice(-2), 10);
    return isNaN(minutes) || isNaN(seconds) ? 0 : minutes * 60 + seconds; // Convert to total seconds
  };

  const totalTime = useMemo(() => {
    const timeOn = parseTime(form.watch("time_on")) || 0; // Time on in seconds
    const timeOff = parseTime(form.watch("time_off")) || 0; // Time off in seconds
    const numberOfSets = Number(form.watch("number_of_sets")) || 0; // Number of sets
    const roundsPerSet = Number(form.watch("rounds_per_set")) || 0; // Rounds per set

    // Calculate total time for one round (time on + time off)
    const totalTimeForOneRound = timeOn + timeOff;

    // Total workout time calculation
    const totalWorkoutTime = totalTimeForOneRound * roundsPerSet * numberOfSets;

    // Convert back to hours, minutes, and seconds
    const totalHours = Math.floor(totalWorkoutTime / 3600);
    const minutes = Math.floor((totalWorkoutTime % 3600) / 60);
    const seconds = totalWorkoutTime % 60;

    return totalWorkoutTime > 0
      ? totalHours > 0
        ? `${String(totalHours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
      : "00:00:00";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("time_on"), form.watch("time_off"), form.watch("number_of_sets"), form.watch("rounds_per_set")]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedData = {
      sets: Number(data.number_of_sets),
      roundsPerSet: Number(data.rounds_per_set),
      timeOn: data.time_on,
      timeOff: data.time_off,
      restBetweenSets: data.rest_time,
    };
    setConfig(formattedData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-8 flex flex-col gap-2 justify-end items-end pt-4 pb-6"
      >
        <FormField
          control={form.control}
          name="number_of_sets"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Number of sets</FormLabel>
                <FormControl>
                  <NumericFormat
                    {...field}
                    customInput={Input}
                    valueIsNumericString
                    onBlur={() => handleBlur("number_of_sets")}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="rounds_per_set"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Rounds per sets</FormLabel>
                <FormControl>
                  <NumericFormat
                    {...field}
                    type="tel"
                    customInput={Input}
                    valueIsNumericString
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      field.onChange(floatValue !== undefined ? floatValue : 0);
                    }}
                    onBlur={() => handleBlur("rounds_per_set")}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="time_on"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Time on</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="##:##"
                    mask={["M", "M", "S", "S"]}
                    {...field}
                    customInput={Input}
                    onBlur={() => {
                      field.onBlur();
                      handleBlur("time_on");
                    }}
                    onValueChange={(values) => {
                      const { formattedValue } = values;
                      field.onChange(formatTime(formattedValue));
                    }}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="time_off"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Time off</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="##:##"
                    mask={["M", "M", "S", "S"]}
                    {...field}
                    customInput={Input}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="rest_time"
          render={({ field }) => (
            <div className="w-full">
              <FormItem>
                <FormLabel>Rest between sets</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="##:##"
                    mask={["M", "M", "S", "S"]}
                    {...field}
                    customInput={Input}
                    onBlur={() => handleBlur("rest_time")}
                  />
                </FormControl>
              </FormItem>
              <FormMessage />
            </div>
          )}
        />

        <div className="flex w-full justify-between items-center gap-6 mt-4">
          <p className="text-foreground">
            <span className="mr-4 tracking-wide">Total workout:</span>{" "}
            <span className="text-2xl border border-primary p-2 rounded-lg font-[family-name:var(--font-secondary)] font-medium tracking-wide">
              {totalTime}
            </span>
          </p>{" "}
          <Button
            type="submit"
            variant="default"
            className="w-1/3 text-base font-semibold"
            onClick={() => {
              setIsRunning(!isRunning);
              setIsSettingsOpened(false);
            }}
          >
            Let&apos;s go
          </Button>
        </div>
      </form>
    </Form>
  );
}
